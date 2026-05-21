import { connectDB } from "@/lib/db";
import Tanker from "@/models/tanker";
import Dispenser from "@/models/dispenser";
import TankerTransaction from "@/models/tanker-transaction";
import { Types } from "mongoose";

export async function transferToDispenserService(
  tankerId: string,
  dispenserId: string,
  quantity: number,
  notes?: string,
) {
  await connectDB();

  // Get tanker
  const tanker = await Tanker.findById(tankerId);
  if (!tanker) {
    throw new Error("Tanker not found");
  }

  // Check sufficient stock
  if (tanker.stockLevel < quantity) {
    throw new Error("Insufficient stock in tanker");
  }

  // Get dispenser
  const dispenser = await Dispenser.findById(dispenserId);
  if (!dispenser) {
    throw new Error("Dispenser not found");
  }

  const beforeTankerStock = tanker.stockLevel;
  const beforeDispenserStock = dispenser.litres || 0;

  // Update tanker stock
  tanker.stockLevel -= quantity;
  await tanker.save();

  // Update dispenser stock
  dispenser.litres = (dispenser.litres || 0) + quantity;
  await dispenser.save();

  // Record transaction
  await TankerTransaction.create({
    tankerId: new Types.ObjectId(tankerId),
    type: "TRANSFER_OUT",
    quantity,
    beforeStock: beforeTankerStock,
    afterStock: tanker.stockLevel,
    details: {
      dispenserId,
      dispenserName: dispenser.name,
      beforeDispenserStock,
      afterDispenserStock: dispenser.litres,
      notes: notes || null,
    },
    timestamp: new Date(),
  });

  return { tanker, dispenser };
}
