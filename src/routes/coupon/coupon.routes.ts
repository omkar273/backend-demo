import { Router } from 'express';
import { createCoupon } from './../../controllers/coupon/coupon.controller.js';

const couponRouter = Router()

couponRouter.post('/create', createCoupon)


export default couponRouter;