import { Request, Response } from "express";

interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: 'CUSTOMER' | 'ORGANIZER';
    };
}
