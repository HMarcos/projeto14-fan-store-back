import { Router } from 'express';
import { getInfoPayment, finishPayment } from './../controllers/paymentController.js';
import { getUserCart } from './../middlewares/cartMiddleware.js';
import  validateToken  from './../middlewares/tokenMiddleware.js';

const paymentRouter = Router();

paymentRouter.get('/paymentinfo', validateToken, getUserCart, getInfoPayment);
paymentRouter.post('/paymentinfo', validateToken, getUserCart, finishPayment);

export default paymentRouter;