import { Router } from 'express';
import homeRouter from './homeRouter.js';
import productRouter from './productRouter.js';

const routers = Router();

routers.use(homeRouter);
routers.use(productRouter);

export default routers;