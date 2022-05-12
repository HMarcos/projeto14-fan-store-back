import { Router } from 'express';
import productsRouter from './productsRouter.js';

const routers = Router();

routers.use(productsRouter);

export default routers;