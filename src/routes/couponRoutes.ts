// src/routes/coupon.routes.ts
import { Router } from 'express';
import CouponController from '../controllers/CouponController';

const router = Router();

router.post('/discount', CouponController.createDiscount);
router.post('/voucher', CouponController.createVoucher);
router.post('/use/:couponId', CouponController.useCoupon);
router.get('/user/:userId', CouponController.getUserCoupons);

export default router;
