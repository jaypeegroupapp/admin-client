import { connectDB } from "@/lib/db";
import Role from "@/models/role";
import { IRole } from "@/definitions/role";

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
