"use server";
import { connectDB } from "@/lib/db";
import Role from "@/models/role";
import User from "@/models/user";
import { getRoleActionsService } from "@/services/role";
import { cache } from "react";
import Action from "@/models/action";

export const getUser = cache(async (userData: any) => {
  await connectDB();

  const user = (await User.findOne(userData).lean()) as any;
  if (!user) return null;

  const roleActions = await getRoleActionsService(user.roleId);
  if (!roleActions) return null;

  // 🟢 Wildcard role → instant allow all
  if (roleActions.includes("*")) {
    return {
      id: user._id.toString(),
      email: user.email,
      password: user.password,
      roleId: user.roleId.toString(),
      permissions: ["*"],
    };
  }

  // Resolve action IDs → "resource:action"
  const actions = await Action.find({
    _id: { $in: roleActions },
  })
    .select("name resource")
    .lean();

  const permissions = actions.map((a) => `${a.resource}:${a.name}`);

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
