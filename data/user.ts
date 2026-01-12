"use server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { getRoleActionsNameService } from "@/services/role";
import { cache } from "react";

export const getUser = cache(async (userData: any) => {
  await connectDB();

  const user = (await User.findOne(userData).lean()) as any;
  if (!user) return null;

  const permissions = await getRoleActionsNameService(user.roleId);

  return {
    id: user._id.toString(),
    email: user.email,
    password: user.password,
    roleId: user.roleId.toString(),
    permissions,
  };
});

export const isUserExists = async (email: string) => {
  try {
    await connectDB();
    const user = await getUser({ email });

    return !!user;
  } catch (error) {
    console.log("Failed to fetch user");
    return null;
  }
};
