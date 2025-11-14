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

export const updateExistingUser = async (
  id: string,
  email: string,
  password: string
) => {
  await connectDB();

  const userId = new Types.ObjectId(id);
  const user = User.findByIdAndUpdate(userId, {
    email,
    password,
    role: COMPANY,
  });

  return user;
};
