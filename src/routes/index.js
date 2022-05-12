import { Router } from 'express';
import homeRouter from './homeRouter.js';

const routers = Router();

routers.use(homeRouter);

export default routers;