import { connectDB } from "@/lib/db";
import Action from "@/models/action";
import { IAction } from "@/definitions/action";

export async function getAllActionsService() {
  await connectDB();
  return await Action.find().sort({ createdAt: -1 }).lean();
}

export async function getActionByIdService(id: string) {
  await connectDB();
  return await Action.findById(id).lean();
}

export async function createActionService(data: IAction) {
  await connectDB();
  return await Action.create(data);
}

export async function updateActionService(id: string, data: Partial<IAction>) {
  await connectDB();
  return await Action.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteActionService(id: string) {
  await connectDB();
  return await Action.findByIdAndDelete(id);
}
