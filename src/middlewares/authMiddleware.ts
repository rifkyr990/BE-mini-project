// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthPayload {
    id: string;
    role: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}

export function auth(requiredRole?: "CUSTOMER" | "ORGANIZER") {
    return (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
            req.user = decoded;

            // 🛑 Jika ada role yang dibutuhkan, cek role user
            if (requiredRole && decoded.role !== requiredRole) {
                return res.status(403).json({ message: "Forbidden: insufficient permissions" });
            }

            next();
        } catch (error) {
            return res.status(401).json({ message: "Invalid token" });
        }
    };
}

// | `auth()`            | 🔐 Hanya login diperlukan       |
// | ------------------- | ------------------------------- |
// | `auth("CUSTOMER")`  | 🔐 Login & role harus CUSTOMER  |
// | `auth("ORGANIZER")` | 🔐 Login & role harus ORGANIZER |
// 