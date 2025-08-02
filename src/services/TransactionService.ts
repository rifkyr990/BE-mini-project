import { prisma } from "../config/prisma";
import { sendEmail } from "../utils/sendMail";
import { transactionSuccessMail } from "../template/transactionSuccesMail";
import { transactionFailedMail } from "../template/transactionFailedMail";
import cloudinary from "../config/cloudinaryConfig";
class TransactionService {
    public static async createTransaction(userId: string, data: {
        eventId: string;
        ticketQty: number;
        couponId?: string;
        usePoints: boolean;
    }) {
    const { eventId, ticketQty, couponId, usePoints } = data;

    const event = await prisma.event.findUnique({
        where: { id: eventId },
    });

    if (!event) throw new Error("Event not found");

    const pricePerTicket = 10000;
    let discount = 0;
    let pointToUse = 0;

    // === CHECK & APPLY COUPON ===
    if (couponId) {
        const coupon = await prisma.coupon.findUnique({
            where: { id: couponId }
        });

        if (!coupon || coupon.userId !== userId) {
            throw new Error("Coupon not valid");
        }

        if (coupon.used) {
            throw new Error("Coupon already used");
        }

        if (new Date(coupon.expiresAt) < new Date()) {
            throw new Error("Coupon expired");
        }

        discount = coupon.value;
    }

    // === CHECK & APPLY POINTS ===
    if (usePoints) {
        const now = new Date();
        const activePoints = await prisma.point.findMany({
        where: {
            userId,
            expiresAt: { gt: now },
        },
            orderBy: { createdAt: 'asc' }
        });

        const totalAvailablePoints = activePoints.reduce((sum, p) => sum + p.amount, 0);
        const sisaSetelahDiskon = pricePerTicket * ticketQty - discount;

        pointToUse = Math.min(sisaSetelahDiskon, totalAvailablePoints);
    }

    // === FINAL TOTAL PRICE ===
    const totalPrice = pricePerTicket * ticketQty - discount - pointToUse;

        const transaction = await prisma.transaction.create({
            data: {
                userId,
                eventId,
                ticketQty,
                totalPrice,
                usedPoints: pointToUse,
                status: "PENDING",
            },
        });

        if (couponId) {
            await prisma.coupon.update({
            where: { id: couponId },
            data: {
                used: true,
                usedAt: new Date(),
                eventId,
            }
            });
        }

        return transaction;
    };

    public static async rejectTransaction(transactionId: string) {
        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId },
            include: { event: true, user: true }
        });

        if (!transaction) throw new Error("Transaction not found");

        // Kembalikan kupon jika ada
        const coupon = await prisma.coupon.findFirst({
            where: {
            userId: transaction.userId,
            eventId: transaction.eventId,
            used: true,
            usedAt: { not: null }
            }
        });

        if (coupon) {
            await prisma.coupon.update({
            where: { id: coupon.id },
            data: {
                used: false,
                usedAt: null
            }
            });
        }

        // Kembalikan poin
        if (transaction.usedPoints && transaction.usedPoints > 0) {
            await prisma.point.create({
            data: {
                userId: transaction.userId,
                amount: transaction.usedPoints,
                expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                source: "PROMOTION"
            }
            });
        }

        // Update status transaksi
        await prisma.transaction.update({
            where: { id: transactionId },
            data: {
            status: "REJECTED"
            }
        });

        const user = await prisma.user.findUnique({
            where: { 
                id: transactionId
            }
        });
        const event = transaction.event;

        if (user) {
            await sendEmail({
                to: user.email,
                subject: "Transaksi Ditolak",
                text: `Maaf, transaksi Anda untuk event "${event.title}" telah ditolak. Kupon dan poin Anda telah dikembalikan.`,
                html: transactionFailedMail(user.name)
            })
        }

        return { message: "Transaction rejected and benefits reverted." };
    }
    
    public static async acceptTransaction(transactionId: string) {
        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId },
            include: { event: true }, 
        });

        if (!transaction) throw new Error("Transaction Not Found");
        if (transaction.status === "ACCEPTED") throw new Error("Already accepted");
        if (transaction.status === "REJECTED") throw new Error("Transaction already rejected");

        const event = transaction.event;

        if (event.seatsTaken + transaction.ticketQty > event.capacity) {
            throw new Error("Seats Not Available")
        }

        await prisma.transaction.update({
            where: { id: transactionId },
            data: {
                status: "ACCEPTED"
            }
        });

        // update jml kursi jika transaksi berhasil
        await prisma.event.update({
            where: { id: event.id },
            data: {
                seatsTaken: event.seatsTaken + transaction.ticketQty
            }
        })

        await prisma.attendee.create({
            data: {
                userId: transaction.userId,
                eventId: event.id,
                ticketQty: transaction.ticketQty,
                totalPaid: transaction.totalPrice
            }
        });

        // kirim email konfirmasi ke user
        const user = await prisma.user.findUnique({
            where: {
                id: transaction.userId
            }
        });

        if (user) {
            await sendEmail({
                to: user.email,
                subject: "Transaksi Diterima",
                text: `Transaksi Anda untuk event "${transaction.event.title}" telah diterima.`,
                html: transactionSuccessMail(user.name),
            });
        }

        return { message: "Transaction accepted and attendee registered." };
    }

    public static async uploadTransactionImage(
        userId: string,
        transactionId: string,
        fileStream?: NodeJS.ReadableStream
        ) {
        let uploadedUrl: string | undefined;

        if (fileStream) {
            uploadedUrl = await new Promise<string>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "payment" },(err, result) => {
                    if (err || !result) return reject(err || new Error("Upload failed"));
                    resolve(result.secure_url);
                }
            );

            fileStream.pipe(uploadStream);
            });
        }

        const update = await prisma.transaction.updateMany({
            where: {
                id: transactionId,
                userId,
            },
            data: {
                proofImage: uploadedUrl,
            },
        });

        if (update.count === 0) {
            throw new Error("Transaction not found or unauthorized");
        }
    }


}

export default TransactionService;