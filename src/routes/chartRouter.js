import {Router} from 'express';
import { postProductChart } from '../controllers/chartController.js';

const chartRouter = Router();

chartRouter.post('/chart', postProductChart);

export default chartRouter;