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

  const dispensers = await Dispenser.find({
    _id: { $in: dispenserIds },
  }).lean();

  return dispensers;
}

export async function getActiveConnectionService(
  tankerId: string,
  dispenserId: string,
) {
  await connectDB();

  return await TankerDispenser.findOne({
    tankerId: new Types.ObjectId(tankerId),
    dispenserId: new Types.ObjectId(dispenserId),
    isActive: true,
  }).lean();
}

export async function getAnyConnectionService(
  tankerId: string,
  dispenserId: string,
) {
  await connectDB();

  return await TankerDispenser.findOne({
    tankerId: new Types.ObjectId(tankerId),
    dispenserId: new Types.ObjectId(dispenserId),
  }).lean();
}

export async function getUnassignedDispensersService() {
  await connectDB();

  // Get all dispensers
  const allDispensers = await Dispenser.find().lean();

  // Get dispensers that are actively connected to any tanker
  const connectedDispenserIds = await TankerDispenser.distinct("dispenserId", {
    isActive: true,
  });

  const connectedIdStrings = connectedDispenserIds.map((id) => id.toString());

  // Filter unassigned dispensers
  const unassignedDispensers = allDispensers.filter(
    (dispenser: any) => !connectedIdStrings.includes(dispenser._id.toString()),
  );

  return unassignedDispensers;
}

export async function connectDispenserService(
  tankerId: string,
  dispenserId: string,
) {
  await connectDB();

  const tankerObjectId = new Types.ObjectId(tankerId);
  const dispenserObjectId = new Types.ObjectId(dispenserId);

  // Check if there's an existing inactive connection
  const existingConnection = await TankerDispenser.findOne({
    tankerId: tankerObjectId,
    dispenserId: dispenserObjectId,
  });

  if (existingConnection) {
    // If connection exists but is inactive, reactivate it
    if (!existingConnection.isActive) {
      existingConnection.isActive = true;
      existingConnection.disconnectedAt = undefined;
      await existingConnection.save();
      return existingConnection;
    }
    // If already active, throw error
    throw new Error("Dispenser is already connected to this tanker");
  }

  // Create new connection
  return await TankerDispenser.create({
    tankerId: tankerObjectId,
    dispenserId: dispenserObjectId,
    isActive: true,
    connectedAt: new Date(),
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
    { new: true },
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
