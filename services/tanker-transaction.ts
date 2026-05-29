import mongoose from "mongoose";
import TankerTransaction from "@/models/tanker-transaction";
import { connectDB } from "@/lib/db";

export async function createTankerTransactionService(data: {
  tankerId: string;
  type: "RESTOCK" | "TRANSFER_OUT" | "SPILLAGE";
  quantity: number;
  beforeStock: number;
  afterStock: number;
  details?: Record<string, any>;
  timestamp?: Date;
}) {
  await connectDB();

  const transaction = await TankerTransaction.create({
    tankerId: new mongoose.Types.ObjectId(data.tankerId),
    type: data.type,
    quantity: data.quantity,
    beforeStock: data.beforeStock,
    afterStock: data.afterStock,
    details: data.details || {},
    timestamp: data.timestamp || new Date(),
  });

  return transaction;
}
