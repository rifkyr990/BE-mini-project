import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    id: string;
    role: "CUSTOMER" | "ORGANIZER";
}

// Extend Express request untuk menyimpan user
declare global {
    namespace Express {
        interface Request {
        user?: JwtPayload;
        }
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: Token not provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
};

export const authorize = (...roles: Array<"CUSTOMER" | "ORGANIZER">) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: No user info" });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: Insufficient role" });
        }

        next();
    };
};
