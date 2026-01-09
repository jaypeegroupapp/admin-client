"server-only";
import { COMPANY } from "@/constants/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { Types } from "mongoose";

export const createUser = async (email: string, password: string) => {
  await connectDB();

  const user = User.create({
    email,
    password,
    role: COMPANY,
  });

  return user;
};

export const updateExistingUser = async (id: string, password: string) => {
  await connectDB();

  const userId = new Types.ObjectId(id);
  const user = User.findByIdAndUpdate(userId, {
    password,
  });

  return user;
};

export const createUserService = async (email: string, role: string) => {
  await connectDB();

  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error("User with this email already exists");
  }

  const user = await User.create({
    email,
    roleId: new Types.ObjectId(role),

    password: "temporary", // replace later with invite/reset flow
  });

  return user;
};
