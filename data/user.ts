import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { cache } from "react";

export const getUser = cache(async (userData: any) => {
  await connectDB();
  return await User.findOne(userData);
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
