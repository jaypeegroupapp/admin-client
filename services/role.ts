import { connectDB } from "@/lib/db";
import Role from "@/models/role";
import { IRole } from "@/definitions/role";
import { Types } from "mongoose";

export async function getAllRolesService() {
  await connectDB();
  return await Role.find().sort({ createdAt: -1 }).lean();
}

export async function getRoleByIdService(id: string) {
  await connectDB();
  return await Role.findById(id).lean();
}

export async function createRoleService(data: IRole) {
  await connectDB();
  return await Role.create(data);
}

export async function updateRoleService(id: string, data: Partial<IRole>) {
  await connectDB();
  return await Role.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteRoleService(id: string) {
  await connectDB();
  return await Role.findByIdAndDelete(id);
}

export async function assignActionToRoleService(
  roleId: string,
  actionId: string
) {
  await connectDB();

  return await Role.findByIdAndUpdate(
    roleId,
    {
      $addToSet: {
        actions: actionId === "*" ? "*" : new Types.ObjectId(actionId),
      },
    },
    { new: true }
  );
}

export async function removeActionFromRoleService(
  roleId: string,
  actionId: string
) {
  await connectDB();

  return await Role.findByIdAndUpdate(
    roleId,
    {
      $pull: {
        actions: actionId === "*" ? "*" : new Types.ObjectId(actionId),
      },
    },
    { new: true }
  );
}

export async function getRoleActionsService(roleId: string) {
  await connectDB();

  const role = await Role.findById(roleId).select("actions").lean();
  if (!role) return null;

  return role.actions.map((a: any) => (a === "*" ? "*" : a.toString()));
}
