import { Router } from 'express';
import { getProducts, getCategories, getFranchises } from '../controllers/homeController.js';

const homeRouter = Router();

homeRouter.get('/products', getProducts);
homeRouter.get('/franchises', getFranchises);
homeRouter.get('/categories', getCategories);

export default homeRouter;