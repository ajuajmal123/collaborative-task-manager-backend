import { User } from "../users/user.model";
import { hashPassword, comparePassword } from "../../utils/hash";
import {
  signAccessToken,
  signRefreshToken,
} from "../../utils/jwt";
import { AppError } from "../../utils/AppError";

export const registerService = async (
  name: string,
  email: string,
  password: string
) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Email already registered", 400);
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return {
    user,
    accessToken: signAccessToken({ userId: user._id.toString() }),
    refreshToken: signRefreshToken({ userId: user._id.toString() }),
  };
};

export const loginService = async (
  email: string,
  password: string
) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  return {
    user,
    accessToken: signAccessToken({ userId: user._id.toString() }),
    refreshToken: signRefreshToken({ userId: user._id.toString() }),
  };
};
