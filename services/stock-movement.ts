import Product from "@/models/product";
import StockMovement from "@/models/stock-movement";
import { connectDB } from "@/lib/db";
import { Types } from "mongoose";

/* export async function addStockService(
  productId: string,
  quantity: number,
  purchasePrice: number,
  sellingPriceAtPurchase: number,
  reason: string
) {
  await connectDB();

  try {
    const product = await Product.findById(productId);
    if (!product) return { success: false, message: "Product not found" };

    product.stock = (product.stock ?? 0) + quantity;
    product.purchasePrice = purchasePrice; // update last cost price
    product.sellingPrice = sellingPriceAtPurchase; // update last selling price
    await product.save();

    await StockMovement.create({
      productId,
      type: "IN",
      quantity,
      purchasePrice,
      sellingPriceAtPurchase,
      reason,
    });

    return { success: true };
  } catch (error) {
    console.error("❌ addStockService", error);
    return { success: false, message: "Failed to add stock" };
  }
}
 */
export async function getStockMovementsByProductIdService(productId: string) {
  await connectDB();

  try {
    const movements = await StockMovement.find({
      productId: new Types.ObjectId(productId),
    })
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(movements));
  } catch (error: any) {
    console.error("❌ getStockMovementsByProductIdService error:", error);
    return [];
  }
}

export async function getProductByIdService(id: string) {
  await connectDB();
  return await Product.findById(id).lean();
}

export async function createStockMovementService(productId: string, data: any) {
  await connectDB();

  return await StockMovement.create({
    productId,
    quantity: data.quantity,
    type: data.type, // "IN" | "OUT"
    purchasePrice: data.purchasePrice ?? null,
    sellingPriceAtPurchase: data.sellingPriceAtPurchase ?? null,
    reason: data.reason || "",
  });
}

export async function updateProductSellingPriceService(
  productId: string,
  sellingPrice: number
) {
  await connectDB();
  return await Product.findByIdAndUpdate(
    productId,
    { sellingPrice },
    { new: true }
  );
}

export async function addStockService(
  productId: string,
  data: { quantity: number; purchasePrice: number; sellingPrice: number }
) {
  await connectDB();

  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  product.stock += data.quantity;
  product.purchasePrice = data.purchasePrice;
  product.sellingPrice = data.sellingPrice;
  await product.save();

  return product;
}

export async function removeStockService(productId: string, qty: number) {
  await connectDB();

  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  if (product.stockQty < qty) {
    throw new Error("Not enough stock available");
  }

  product.stock -= qty;
  await product.save();

  return product;
}

/* export async function getStockMovementsByProductIdService(productId: string) {
  await connectDB();
  return await StockMovement.find({ productId }).sort({ createdAt: -1 }).lean();
}
 */
