import { Router } from "express";
import { verifyJwt } from "../../middlewares/auth.middleware.js";
import { logoutUser } from './../../controllers/auth/logout_user.js';
import { registerUser } from './../../controllers/auth/register_user.js';
import { loginUser } from './../../controllers/auth/login_user.js';
import { getUser } from './../../controllers/auth/get_user.js';
import { verifyEmail } from './../../controllers/auth/verify_email.js';
import { sendVerificationEmail } from './../../controllers/auth/send_verification_email.js';
import { sendPasswordResetEmail } from './../../controllers/auth/send_password_reset_email.js';
import { resetPassword } from './../../controllers/auth/reset_password.js';

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

