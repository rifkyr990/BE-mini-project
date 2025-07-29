import jwt, { Secret, SignOptions } from 'jsonwebtoken';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'secret';

export function signToken(payload: object, expiresIn: string = '1h'): string {
    const options: SignOptions = { expiresIn: expiresIn as any };
    return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): any {
    return jwt.verify(token, JWT_SECRET);
}
