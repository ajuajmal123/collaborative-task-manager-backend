import { Router } from "express";
import { register, login, logout, getMyProfile, updateMyProfile } from "./auth.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
authRoutes.get("/me",requireAuth, getMyProfile);
authRoutes.put("/me", requireAuth,updateMyProfile);
export default authRoutes;
