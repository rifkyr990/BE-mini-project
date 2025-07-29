import { Request, Response } from "express";
import prisma from '../config/prisma';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class AuthController {
    public async register(req: Request, res: Response): Promise<void> {
        try {
            const { email, password, name, role, referralCode } = req.body;
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                res.status(400).json({ message: "Email already taken" });
                return;
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            let referredById: string | undefined = undefined;

            if (referralCode) {
                const referrer = await prisma.user.findUnique({ where: { referralCode } });

                if (!referrer) {
                    res.status(400).json({ message: "Invalid referral code" });
                    return;
                }
                referredById = referrer.id;
            }

            const newUser = await prisma.user.create({
                data: {
                email,
                password: hashedPassword,
                name,
                role,
                referredById,
                },
            });

            if (referralCode && referredById) {
                await prisma.point.create({
                    data: {
                        userId: referredById,
                        amount: 10000,
                        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                    },
                });

                await prisma.coupon.create({
                    data: {
                        userId: newUser.id,
                        type: "DISCOUNT",
                        value: 10000,
                        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                    },
                });
            }

            res.status(201).json({
                message: "User registered successfully",
                referralCode: newUser.referralCode,
            });
        } catch (error) {
            console.error("Error in register:", error);
            res.status(500).json({ message: "Registration failed" });
        }
    }

    public async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                res.status(400).json({ message: "Invalid credentials" });
                return;
            }

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                res.status(400).json({ message: "Invalid credentials" });
                return;
            }

            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET!,
                { expiresIn: "1d" }
            );

            res.status(200).json({ token });
        } catch (error) {
            console.error("Error in login:", error);
            res.status(500).json({ message: "Login failed" });
        }
    }

    public async getProfile(req: Request, res: Response): Promise<void> {
        try {
            const user = await prisma.user.findUnique({
                    where: { id: req.user!.id },
                    select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    referralCode: true,
                    profileImage: true,
                },
        });

            res.status(200).json(user);
        } catch (error) {
            console.error("Error in getProfile:", error);
            res.status(500).json({ message: "Failed to get profile" });
        }
    }

    public async updateProfile(req: Request, res: Response): Promise<void> {
        try {
            const { name, password, profileImage } = req.body;
            const updateData: any = { name, profileImage };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updated = await prisma.user.update({
            where: { id: req.user!.id },
            data: updateData,
        });

            res.status(200).json({ message: "Profile updated", user: updated });
        } catch (error) {
            console.error("Error in updateProfile:", error);
            res.status(500).json({ message: "Failed to update profile" });
        }
    }

    public async forgotPassword(req: Request, res: Response) {
        const { email } = req.body;

        try {
            const user = await prisma.user.findUnique({where: {email}});
            if (!user) {
                return res.status(404).json({ message: "Email tidak ada "});
            }

            const resetToken = jwt.sign(
                {id: user.id},
                process.env.JWT_SECRET!,
                {expiresIn: "15m"}
            );

            const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

            res.json({
                message: "Reset link",
                resetLink,
            });
        } catch (error) {
            console.error("Forgot password error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }

    public async resetPassword(req: Request, res: Response) {
        const { token, newPassword } = req.body;

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
            const hashed = await bcrypt.hash(newPassword, 10);

            await prisma.user.update({
                where: { id: decoded.id },
                data: { password: hashed },
            });

            res.json({ 
                message: "Password reset successful"
            });
        } catch (error) {
            console.error("Reset password error:", error);
            res.status(400).json({ message: "Invalid or expired token" });
        }
    }
}

export default AuthController;
