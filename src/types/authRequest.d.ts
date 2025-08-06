import { Request } from "express";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'CUSTOMER' | 'ORGANIZER';
  };
  query: {
    [key: string]: string | undefined;
  };
}
