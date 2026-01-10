import { IStaff } from "@/definitions/staff";
import { IMine } from "@/definitions/mine";
import { connectDB } from "@/lib/db";
import Mine from "@/models/mine";
import Staff from "@/models/staff";
import { Types } from "mongoose";

export async function getAllStaffService() {
  await connectDB();
  return await Staff.find().sort({ createdAt: -1 }).lean();
}

export async function getStaffByIdService(id: string): Promise<IStaff | null> {
  await connectDB();

  const staff = (await Staff.findById(id).lean()) as any;
  if (!staff) return null;

  // ⭐ FULL ACCESS CASE
  if (staff.mines?.includes("*")) {
    return {
      id: staff._id.toString(),
      name: staff.name,
      status: staff.status,
      userId: staff.userId.toString(),
      mines: ["*"], // 👈 signal full access to UI
      createdAt: staff.createdAt,
      updatedAt: staff.updatedAt,
    };
  }

  // 🔒 LIMITED ACCESS CASE
  const mines = await Mine.find({
    _id: { $in: staff.mines },
  }).lean();

  const mineNames: IMine[] = mines.map((m: any) => ({
    id: m._id.toString(),
    name: m.name,
    isActive: m.isActive ?? false,
    createdAt: m.createdAt?.toISOString(),
    updatedAt: m.updatedAt?.toISOString(),
  }));

  return {
    id: staff._id.toString(),
    name: staff.name,
    status: staff.status,
    userId: staff.userId.toString(),
    mines: mineNames,
    createdAt: staff.createdAt,
    updatedAt: staff.updatedAt,
  };
}

export async function getStaffService(id: string) {
  await connectDB();
  return await Staff.findOne({ userId: new Types.ObjectId(id) }).lean();
}

export async function createStaffService(data: IStaff) {
  await connectDB();
  return await Staff.create(data);
}

export async function updateStaffService(id: string, data: Partial<IStaff>) {
  await connectDB();
  return await Staff.findByIdAndUpdate(id, data, { new: true });
}

/** Assign "*" or a specific mine */
export async function assignMineToStaffService(
  staffId: string,
  mineId: string
) {
  await connectDB();

  return await Staff.findByIdAndUpdate(
    staffId,
    {
      $addToSet: {
        mines: mineId === "*" ? "*" : new Types.ObjectId(mineId),
      },
    },
    { new: true }
  );
}

/** Remove "*" or a specific mine */
export async function removeMineFromStaffService(
  staffId: string,
  mineId: string
) {
  await connectDB();

  return await Staff.findByIdAndUpdate(
    staffId,
    {
      $pull: {
        mines: mineId === "*" ? "*" : new Types.ObjectId(mineId),
      },
    },
    { new: true }
  );
}

export async function getStaffMinesService(staffId: string) {
  await connectDB();

  const staff = (await Staff.findById(staffId).select("mines").lean()) as any;
  if (!staff) return null;

  // 🔒 If wildcard exists, return ONLY "*"
  if (staff.mines?.includes("*")) {
    return ["*"];
  }

  return staff.mines.map((m: any) => m.toString());
}
