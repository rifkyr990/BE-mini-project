import { Request, Response } from 'express';
import CouponService from '../services/CouponService';
import { asyncHandler } from '../helpers/asyncHandler';

class CouponController {
    public createDiscount = asyncHandler(async (req: Request, res: Response) => {
        const { userId, value, expiresAt } = req.body;
        const coupon = await CouponService.createDiscountCoupon(userId, value, new Date(expiresAt));

        res.status(201).json(coupon);
    });

    public createVoucher = asyncHandler(async (req: Request, res: Response) => {
        const { userId, eventId, value, expiresAt } = req.body;
        const coupon = await CouponService.createVoucherCoupon(userId, eventId, value, new Date(expiresAt));

        res.status(201).json(coupon);
    });

    public useCoupon = asyncHandler(async (req: Request, res: Response) => {
        const { couponId } = req. params;
        const updated = await CouponService.useCoupon(couponId);

        res.json(updated);
    })

    public getUserCoupons = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.params;
        const coupons = await CouponService.getUserCoupons(userId);
        
        res.json(coupons);
    })
}

export default new CouponController();