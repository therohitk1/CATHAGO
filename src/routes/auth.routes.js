import { Router } from "express";
import { login, logout, register, renderLogin, renderRegister } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.route("/register").get(renderRegister).post(register);
authRouter.route("/login").get(renderLogin).post(login);
authRouter.route("/logout").get(logout);

export default authRouter;