import { Router } from "express";
import { valitateRegister, validateLogin } from "../middlewares/authMIddleware.js";
import { singUp, singIn, logout } from "./../controllers/authController.js";
import validateToken from './../middlewares/tokenMiddleware.js';
import { getUserCart } from './../middlewares/cartMiddleware.js';

const authRouter = Router();

authRouter.post("/sign-up", valitateRegister, singUp);
authRouter.post("/sign-in", validateLogin, singIn);
authRouter.put("/logout", validateToken, getUserCart, logout);

export default authRouter;