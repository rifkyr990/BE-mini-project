// src/types/custom.d.ts
declare namespace Express {
  export interface Request {
    userId?: string; // Menambahkan `userId` ke tipe `Request`
  }
}
