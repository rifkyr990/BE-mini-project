import { prisma } from "../config/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Role, PointSource } from "@prisma/client";
import { generateReferralCode } from "../utils/generatedReferal";
import cloudinary from "../config/cloudinaryConfig";
import { addMonths, addDays } from 'date-fns';
import { sendEmail } from "../utils/sendMail";
import { confirmEmailTemplate } from "../template/confirmEmailTemplate";

class AuthService {

    public static async register(data: {email: string;password: string;name: string;role: string;referralCode?: string;}) {
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
            const expiresAt = addDays(new Date(), 1);
            await prisma.point.create({
                data: {
                    userId: referredById,
                    amount: 10000,
                    expiresAt,
                    source: PointSource.REFERRAL,
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

        const emailToken = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
        await prisma.emailVerificationToken.create({
            data: {
                userId: newUser.id,
                token: emailToken,
                expiresAt: addDays(new Date(), 1),
            },
        });

        const verifyLink = `http://localhost:4000/api/auth/verify-email?token=${emailToken}`;
        console.log("Verify email link:", verifyLink);
        await sendEmail({
            to: email,
            subject: 'Verify Your Email',
            text: `Please verify your email by clicking the following link:\n\n${verifyLink}`,
            html: confirmEmailTemplate(name, verifyLink),
        });

        return {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            referralCode: newUser.referralCode,
            referredBy: referredById ? cleanWhiteSpace : null,
        };
    }

    public static async verifyEmail(token: string) {
        const record = await prisma.emailVerificationToken.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!record) {
            throw new Error("Invalid or expired verification token");
        }

        if (record.expiresAt < new Date()) {
            throw new Error("Verification token has expired");
        }

        // Update user
        await prisma.user.update({
            where: { id: record.userId },
            data: { isVerified: true },
        });

        // Hapus token
        await prisma.emailVerificationToken.delete({
            where: { token },
        });

        return "Email verified successfully";
    }


    // public static async login(email: string, password: string) {
    //     const user = await prisma.user.findUnique({ where: { email }, include: {points: true} });

    //     if (!user || !(await bcrypt.compare(password, user.password))) {
    //         throw new Error("Password or email is wrong");
    //     }

    //     const token = jwt.sign(
    //         { id: user.id, role: user.role },
    //         process.env.JWT_SECRET!,
    //         { expiresIn: "1d" }
    //     );

    //     return { token };
    // }
    public static async login(email: string, password: string) {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { points: true },
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error("Password salah gaess");
        }

        const totalPoints = user.points.reduce((acc, point) => acc + point.amount, 0);

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "1d" }
        );

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                profileImage: user.profileImage,
                points: totalPoints,
            }
        };
    }


    public static async getProfile(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
            points: true,
            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const totalPoints = user.points.reduce((acc, point) => acc + point.amount, 0);

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            referralCode: user.referralCode,
            profileImage: user.profileImage,
            points: totalPoints,
        };
    }

    public static async updateProfile(userId: string, data: any, fileStream?: NodeJS.ReadableStream) {
        let uploadedUrl;

        if (fileStream) {
            uploadedUrl = await new Promise<string>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({ folder: 'upload' }, (err, result) => {
                if (err || !result) return reject(err);
                resolve(result.secure_url);
            });

            fileStream.pipe(uploadStream);
            });
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('User not found');

        if (data.currentPassword && data.newPassword) {
            const isMatch = await bcrypt.compare(data.currentPassword, user.password);
            if (!isMatch) {
                throw new Error('Password lama salah');
            }
            data.password = await bcrypt.hash(data.newPassword, 10);
        }

        
        if (data.email && data.email !== user.email) {
            const emailToken = jwt.sign(
                { userId, email: data.email },
                process.env.JWT_SECRET!,
                { expiresIn: '1h' }
            );

            await prisma.emailVerificationToken.create({
                data: {
                    userId: user.id,
                    token: emailToken,
                    expiresAt: addDays(new Date(), 1),
                },
            });

            const verifyLink = `http://localhost:4000/api/auth/verify-email?token=${emailToken}`;

            console.log("Verify email link:", verifyLink);

            await sendEmail({
                to: data.email,
                subject: 'Verify Your Email',
                text: `Please verify your email by clicking the following link:\n\n${verifyLink}`,
                html: confirmEmailTemplate(data.name || user.name, verifyLink),
            });
        }

        // Jangan ikutkan field yg tidak dikenal
        delete data.currentPassword;
        delete data.newPassword;

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

        // const resetLink = `http://localhost:4000/api/auth/reset-password?token=${token}`;
        const resetLink = `http://localhost:3000/auth/reset-password?token=${token}`;

        // Kirim email reset password di sini
        return { resetLink };
    }

    // public static async resetPassword(token: string, newPassword: string) {
    //     const record = await prisma.passwordResetToken.findUnique({
    //         where: { token },
    //         include: { user: true },
    //     });

    //     if (!record) {
    //         throw new Error("Invalid or expired token");
    //     }

    //     if (record.expiresAt < new Date()) {
    //         throw new Error("Token expired");
    //     }

    //     const hashed = await bcrypt.hash(newPassword, 10);

    //     await prisma.user.update({
    //         where: { id: record.userId },
    //         data: { password: hashed },
    //     });

    //     // Hapus token setelah digunakan
    //     await prisma.passwordResetToken.delete({
    //         where: { token },
    //     });

    //     return { message: "Password reset successful" };
    // }
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

    public async verifyEmail() {

    }
}

export default AuthService;
