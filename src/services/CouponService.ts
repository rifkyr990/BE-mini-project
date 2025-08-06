import { prisma } from "../config/prisma";

class CouponService {
    public static async createDiscountCoupon(userId: string, value: number, expiresAt: Date) {
        return prisma.coupon.create({
            data: {
                userId,
                type: 'DISCOUNT',
                value,
                expiresAt,
            },
        });
    }

    public static async createVoucherCoupon(userId: string, eventId: string, value: number, expiresAt: Date) {
        return prisma.coupon.create({
            data: {
                userId,
                type: 'VOUCHER',
                eventId,
                value,
                expiresAt,
            },
        });
    }

    public static async useCoupon(couponId: string) {
        const coupon = await prisma.coupon.findUnique({ where: { id: couponId }});

        if (!coupon) throw new Error('Coupon not found');
        if (coupon.used) throw new Error('Coupon already used');
        if (coupon.expiresAt < new Date()) throw new Error('Coupon expired');

        return prisma.coupon.update({
            where: { id: couponId },
            data: {
                used: true,
                usedAt: new Date(),
            }
        });
    }

    public static async getUserCoupons(userId: string) {
        return prisma.coupon.findMany({
            where: { userId },
            include: {
                event: true,
            }
        })
    }
}

export default CouponService;