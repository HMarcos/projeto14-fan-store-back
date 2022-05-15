import { Router } from 'express';
import { updateProductCart } from './../controllers/cartController.js';
import { validateProduct, getUserCart } from './../middlewares/cartMiddleware.js';
import  validateToken  from './../middlewares/tokenMiddleware.js';

const cartRouter = Router();

cartRouter.put('/cart', validateToken, validateProduct, getUserCart, updateProductCart);

export default cartRouter;