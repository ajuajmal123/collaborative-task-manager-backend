import { User } from "../users/user.model";
import { hashPassword, comparePassword } from "../../utils/hash";
import { signToken } from "../../utils/jwt";
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

  const token = signToken({ userId: user._id });

  return { user, token };
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
if ( !isMatch) {
  throw new AppError("Invalid credentials", 401);
}
  const token = signToken({ userId: user._id });

  return { user, token };
};
