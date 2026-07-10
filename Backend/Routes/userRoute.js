import express from "express";
import {loginUser, verifyLoginOtp, registerUser, verifyRegisterOtp, getUserProfile, updateUserProfile, toggleFavorite, getFavorites, forgotPassword, resetPassword} from "../Controllers/userController.js";
import authMiddleware from "../Middleware/Auth.js";

const userRouter = express.Router();

userRouter.post("/login", loginUser);
userRouter.post("/verify-login-otp", verifyLoginOtp);
userRouter.post("/register", registerUser);
userRouter.post("/verify-register-otp", verifyRegisterOtp);
userRouter.get("/profile", authMiddleware, getUserProfile);
userRouter.post("/profile", authMiddleware, updateUserProfile);
userRouter.post("/favorites", authMiddleware, toggleFavorite);
userRouter.get("/favorites", authMiddleware, getFavorites);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);

export default userRouter;