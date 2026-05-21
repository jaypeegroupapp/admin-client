import { connectDB } from "@/lib/db";
import TankerDispenser from "@/models/tanker-dispenser";
import Dispenser from "@/models/dispenser";
import { Types } from "mongoose";

export async function getTankerDispensersService(tankerId: string) {
  await connectDB();

  const connections = await TankerDispenser.find({
    tankerId: new Types.ObjectId(tankerId),
    isActive: true,
  }).lean();

  const dispenserIds = connections.map((c) => c.dispenserId);

  const dispensers = (await Dispenser.find({
    _id: { $in: dispenserIds },
  }).lean()) as any[];

  return dispensers;
}

export async function getUnassignedDispensersService() {
  await connectDB();

  // Get all dispensers
  const allDispensers = (await Dispenser.find().lean()) as any[];

  // Get dispensers that are already connected to any tanker
  const connectedDispenserIds = await TankerDispenser.distinct("dispenserId", {
    isActive: true,
  });

  const connectedIdStrings = connectedDispenserIds.map((id) => id.toString());

  // Filter unassigned dispensers
  const unassignedDispensers = allDispensers.filter(
    (dispenser) => !connectedIdStrings.includes(dispenser._id.toString()),
  );

  return unassignedDispensers;
}

export async function connectDispenserService(
  tankerId: string,
  dispenserId: string,
) {
  await connectDB();

  return await TankerDispenser.create({
    tankerId: new Types.ObjectId(tankerId),
    dispenserId: new Types.ObjectId(dispenserId),
    isActive: true,
  });
}

export async function disconnectDispenserService(
  tankerId: string,
  dispenserId: string,
) {
  await connectDB();

  return await TankerDispenser.findOneAndUpdate(
    {
      tankerId: new Types.ObjectId(tankerId),
      dispenserId: new Types.ObjectId(dispenserId),
      isActive: true,
    },
    { isActive: false, disconnectedAt: new Date() },
  );
}

export async function isDispenserConnectedToTankerService(dispenserId: string) {
  await connectDB();

  const connection = await TankerDispenser.findOne({
    dispenserId: new Types.ObjectId(dispenserId),
    isActive: true,
  }).lean();

  return !!connection;
}
