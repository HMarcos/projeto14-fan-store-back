import { Router } from "express";
import { valitateRegister, validateLogin } from "../middlewares/authMIddleware.js";
import { singUp, singIn } from "./../controllers/authController.js";

const authRouter = Router();

authRouter.post("/sign-up", valitateRegister, singUp);
authRouter.post("/sign-in", validateLogin, singIn);
//authRouter.delete("/logout", validateToken, logout);

export default authRouter;