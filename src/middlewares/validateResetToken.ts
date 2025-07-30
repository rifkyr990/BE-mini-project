import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma'; // Pastikan prisma diimport dengan benar

export async function validateResetToken(req: Request, res: Response, next: NextFunction) {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({
            error: 'Token is required'
        });
    }

    try {
        // Verifikasi token JWT
        const decoded = jwt.verify(token as string, process.env.JWT_SECRET!) as { id: string };

        // Cek apakah token ada di database
        const resetTokenRecord = await prisma.passwordResetToken.findUnique({
            where: { token: token as string }
        });

        if (!resetTokenRecord) {
            return res.status(400).json({
                error: 'Invalid token'
            });
        }

        // Cek apakah token sudah kadaluarsa
        if (resetTokenRecord.expiresAt < new Date()) {
            return res.status(400).json({
                error: 'Token expired'
            });
        }
        
        req.userId = decoded.id;
        next();
    } catch (error: unknown) {
        console.error('Token verification failed:', error);
        return res.status(400).json({ error: 'Invalid or expired token' });
    }
}