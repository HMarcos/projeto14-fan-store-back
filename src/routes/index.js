import { Router } from 'express';
import homeRouter from './homeRouter.js';
import authRouter from './authRouter.js';

const routers = Router();

routers.use(homeRouter);
routers.use(authRouter);

export default routers;