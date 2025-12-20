import { Request, Response } from "express";
import { registerSchema, loginSchema } from "./auth.dto";
import { User } from "../users/user.model";
import {
  registerService,
  loginService,
} from "./auth.service";
import { verifyRefreshToken, signAccessToken } from "../../utils/jwt";
import { AppError } from "../../utils/AppError";
import { env } from "../../config/env";

// REGISTER
export const register = async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error);
  }

  const { user, accessToken, refreshToken } =
    await registerService(
      parsed.data.name,
      parsed.data.email,
      parsed.data.password
    );

  res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",//env.NODE_ENV === "production" ? "lax" : "lax",
      maxAge: 15 * 60 * 1000,
      path: "/"
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax" ,//env.NODE_ENV === "production" ? "lax" : "lax",
      maxAge:  7 * 24 * 60 * 60 * 1000,
      path: "/"
    })
    .status(201)
    .json({ user });
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.issues[0],
      });
    }

    const { email, password } = parsed.data;

    const { user, accessToken, refreshToken } =
      await loginService(email, password);

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",//production" ? "lax" : "lax",
        secure: env.NODE_ENV === "production",
         maxAge: 15 * 60 * 1000,
      path: "/"
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite:"lax", //env.NODE_ENV === "production" ? "lax" : "lax",
        secure: env.NODE_ENV === "production",
         maxAge:  7 * 24 * 60 * 60 * 1000,
      path: "/"
      })
      .status(200)
      .json({ user });
  } catch (err: any) {
    return res.status(err.statusCode || 401).json({
      message: err.message || "Invalid credentials",
    });
  }
};

//logout
export const logout = async (_req: Request, res: Response) => {
  res
    .clearCookie("accessToken", {
      httpOnly: true,
      sameSite:"lax", //env.NODE_ENV === "production" ? "lax" : "lax",
      secure: env.NODE_ENV === "production",
    })
    .clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",//env.NODE_ENV === "production" ? "lax" : "lax",
      secure: env.NODE_ENV === "production",
    })
    .status(200)
    .json({ message: "Logged out" });
};


//get user profile
export const getMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.userId?.toString();
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId).select("name email");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch {
    return res.status(500).json({ message: "Failed to fetch profile" });
  }
};



  //Update current user's profile
 
export const updateMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.userId?.toString();
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name },
      { new: true }
    ).select("name email");

    return res.json(user);
  } catch {
    return res.status(500).json({ message: "Failed to update profile" });
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  const users = await User.find().select("_id name email");
  res.json(users);
};

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new AppError("No refresh token", 401);
  }

  try {
    const payload = verifyRefreshToken(refreshToken);

    const newAccessToken = signAccessToken({
      userId: payload.userId,
    });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      sameSite: "lax",//env.NODE_ENV === "production" ? "none" : "lax",
      secure: env.NODE_ENV === "production",
    });

    return res.status(200).json({ message: "Access token refreshed" });
  } catch {
    throw new AppError("Invalid refresh token", 401);
  }
};