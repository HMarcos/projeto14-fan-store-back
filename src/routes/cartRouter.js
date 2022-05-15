import {Router} from 'express';
import { postProductCart } from '../controllers/cartController.js';

const cartRouter = Router();

cartRouter.post('/cart', postProductCart);

export default cartRouter;