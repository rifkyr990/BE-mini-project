import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { sendEmail } from "../utils/sendMail";
import { resetpassMailTemplate } from "../template/resetpassMailTemplate";
import { asyncHandler } from "../helpers/asyncHandler"; // Import asyncHandler

class AuthController {
    // Gunakan asyncHandler untuk membungkus setiap handler
    public register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const newUser = await AuthService.register(req.body);
        res.status(201).json({
            message: "User registered successfully",
            referralCode: newUser.referralCode,
        });
    });

    public login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { email, password } = req.body;
        const result = await AuthService.login(email, password);
        res.status(200).json({ message: "Login berhasil", token: result.token });
    });

    public getProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const user = await AuthService.getProfile(req.user!.id);
        res.status(200).json(user);
    });

    public updateProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const user = await AuthService.updateProfile(req.user!.id, req.body);  // Ambil file image dari req.file
        res.status(200).json({ message: "Profile updated", user });
    });
    

    public forgotPassword = asyncHandler(async (req: Request, res: Response) => {
        const { email, name } = req.body;
        const { resetLink } = await AuthService.forgotPassword(email);

        // Kirim email reset password
        await sendEmail({
            to: email,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Click the link below to reset your password:\n\n${resetLink}`,
            html: resetpassMailTemplate(name, resetLink)
        });

        return res.status(200).json({ message: 'Password reset link has been sent to your email' });
    });

    public resetPassword = asyncHandler(async (req: Request, res: Response) => {
        const { token } = req.query;
        const { newPassword } = req.body;

        const { userId } = req;
        if (!userId) {
            return res.status(400).json({ error: 'Invalid userId' });
        }
        // Reset password untuk user
        const result = await AuthService.resetPassword(token as string, newPassword);

        return res.status(200).json({ message: result.message });
    });
}

export default AuthController;
