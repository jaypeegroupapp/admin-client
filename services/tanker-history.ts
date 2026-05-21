import { connectDB } from "@/lib/db";
import TankerTransaction from "@/models/tanker-transaction";
import { Types } from "mongoose";

export async function getTankerTransactionHistoryService(tankerId: string) {
  await connectDB();

  return await TankerTransaction.find({
    tankerId: new Types.ObjectId(tankerId),
  })
    .sort({ timestamp: -1 })
    .lean();
}
