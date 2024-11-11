import { Router } from "express";
import { sendPasswordResetEmail, getUser, loginUser, logoutUser, registerUser, verifyEmail, resetPassword, sendVerificationEmail } from "../../controllers/auth/auth.controller.js";
import { verifyJwt } from "../../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.route("/login").post(loginUser);

authRouter.route("/logout").post(verifyJwt, logoutUser);

authRouter.route("/register").post(registerUser);

authRouter.route("/user/me").get(verifyJwt, getUser);

authRouter.route("/verify-email/:token").get(verifyEmail);

authRouter.route("/veriy-email").post(sendVerificationEmail);

authRouter.route("/forgot-password").post(sendPasswordResetEmail);

authRouter.route("/reset-password").post(resetPassword);

export default authRouter;

