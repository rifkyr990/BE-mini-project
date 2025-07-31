import { prisma } from "../config/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Role, PointSource } from "@prisma/client";
import { generateReferralCode } from "../utils/generatedReferal";
import cloudinary from "../config/cloudinaryConfig";

export class AuthService {
    public static async register(data: {
        email: string;
        password: string;
        name: string;
        role: string;
        referralCode?: string;
    }) {
        const { email, password, name, role, referralCode } = data;
        const cleanWhiteSpace = referralCode?.trim();

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error("Email already taken");
        }

        const roleUpper = role?.toUpperCase();
        if (!Object.values(Role).includes(roleUpper as Role)) {
            throw new Error("Invalid role");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let referredById: string | undefined = undefined;
        if (cleanWhiteSpace) {
            const referrer = await prisma.user.findUnique({ where: { referralCode: cleanWhiteSpace } });
            if (!referrer) {
                throw new Error("Invalid referral code");
            }
            referredById = referrer.id;
        }

        let code: string;
        let isUnique = false;
        
        do {
            code = generateReferralCode(6);
            const existing = await prisma.user.findUnique({
                where: {
                    referralCode: code
                }
            });
            if (!existing) {
                isUnique = true;
            }
        } while (!isUnique);

        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: roleUpper as Role,
                referralCode: code,
                referredById,
            },
        });

        if (cleanWhiteSpace && referredById) {
            const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
            await prisma.point.create({
                data: {
                    userId: referredById,
                    amount: 10000,
                    expiresAt,
                    source: PointSource.REFERRAL, // <-- Tambahkan ini
                },
            });

            await prisma.coupon.create({
                data: {
                    userId: newUser.id,
                    type: "DISCOUNT",
                    value: 10000,
                    expiresAt,
                },
            });
        }

        return newUser;
    }

    public static async login(email: string, password: string) {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error("Invalid credentials");
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "1d" }
        );

        return { token };
    }

    public static async getProfile(userId: string) {
        return prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                referralCode: true,
                profileImage: true,
            },
        });
    }

    public static async updateProfile(userId: string, data: any, fileStream?: NodeJS.ReadableStream) {
        let uploadedUrl;

        if (fileStream) {
            // Misalnya upload ke Cloudinary
            uploadedUrl = await new Promise<string>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream({ folder: 'avatars' }, (err, result) => {
                    if (err || !result) return reject(err);
                    resolve(result.secure_url);
                });

                fileStream.pipe(uploadStream);
            });
        }


        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...data,
                ...(uploadedUrl ? { profileImage: uploadedUrl } : {}),
            },
        });
        return updatedUser;
    }

    public static async forgotPassword(email: string) {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new Error("Email not found");
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '15m' });
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        // Hapus token lama (opsional)
        await prisma.passwordResetToken.deleteMany({
            where: {
                userId: user.id,
            },
        });

        await prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                token,
                expiresAt,
            },
    });

    const resetLink = `http://localhost:4000/api/auth/reset-password?token=${token}`;

    // Kirim email reset password di sini
    return { resetLink };
    }

    public static async resetPassword(token: string, newPassword: string) {
        const record = await prisma.passwordResetToken.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!record) {
            throw new Error("Invalid or expired token");
        }

        if (record.expiresAt < new Date()) {
            throw new Error("Token expired");
        }

        const hashed = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: record.userId },
            data: { password: hashed },
        });

        // Hapus token setelah digunakan
        await prisma.passwordResetToken.delete({
            where: { token },
        });

        return { message: "Password reset successful" };
    }
}
