import { Router } from 'express';
import { getProductById } from '../controllers/productController.js';

const productRouter = Router();

productRouter.get('/product/:productId', getProductById);

export default productRouter;