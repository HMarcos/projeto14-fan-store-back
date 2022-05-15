import { Router } from 'express';
import homeRouter from './homeRouter.js';
import productRouter from './productRouter.js';
import authRouter from './authRouter.js';
import cartRouter from './cartRouter.js'

const routers = Router();

routers.use(homeRouter);
routers.use(productRouter);
routers.use(authRouter);
routers.use(cartRouter);

export default routers;