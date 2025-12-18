import { Router } from "express";
import { register, login, logout, getMyProfile, updateMyProfile, getUsers, refresh } from "./auth.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
authRoutes.get("/me",requireAuth, getMyProfile);
authRoutes.put("/me", requireAuth,updateMyProfile);
authRoutes.get("/",requireAuth, getUsers);
authRoutes.post("/refresh", refresh);
export default authRoutes;
