import { PrismaClient } from "@prisma/client";

declare global {
  // globalThis.prisma agar tidak buat banyak instance di dev
    var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
