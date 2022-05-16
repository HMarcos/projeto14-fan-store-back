import { Router } from 'express';
import { updateProductCart, renderCart, deleteProductCart, getInfoPayment } from './../controllers/cartController.js';
import { validateProduct, getUserCart } from './../middlewares/cartMiddleware.js';
import  validateToken  from './../middlewares/tokenMiddleware.js';

const cartRouter = Router();

cartRouter.put('/cart', validateToken, validateProduct, getUserCart, updateProductCart);
cartRouter.get('/cart', validateToken, getUserCart, renderCart);
cartRouter.delete('/cart/:idProduct', validateToken, getUserCart, deleteProductCart);
cartRouter.get('/paymentinfo', validateToken, getUserCart, getInfoPayment);


export default cartRouter;