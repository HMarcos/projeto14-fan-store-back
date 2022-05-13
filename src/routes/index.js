import { Router } from 'express';
import homeRouter from './homeRouter.js';
import productRouter from './productRouter.js';
import authRouter from './authRouter.js';

const routers = Router();

routers.use(homeRouter);
routers.use(productRouter);
routers.use(authRouter);

export default routers;