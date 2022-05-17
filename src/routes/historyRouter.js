import { Router } from 'express';
import { getPurchaseHistory } from './../controllers/historyController.js';
import  validateToken  from './../middlewares/tokenMiddleware.js';

const historyRouter = Router();

historyRouter.get('/history', validateToken, getPurchaseHistory);

export default historyRouter;