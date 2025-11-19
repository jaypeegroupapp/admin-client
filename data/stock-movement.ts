"use server";
import { getStockMovementsByProductIdService } from "@/services/stock-movement";

/* -------------------------  MAPPER  ------------------------- */
function stockMovementMap(movement: any) {
  return {
    id: movement._id.toString(),
    productId: movement.productId?.toString(),
    type: movement.type,
    quantity: movement.quantity,
    purchasePrice: movement.purchasePrice,
    sellingPriceAtPurchase: movement.sellingPriceAtPurchase,
    reason: movement.reason,
    createdAt: movement.createdAt,
  };
}

/* ------------------  PUBLIC FETCH FUNCTION  ------------------ */
export async function getStockMovementsByProductId(productId: string) {
  try {
    const movements = await getStockMovementsByProductIdService(productId);

    return Array.isArray(movements) ? movements.map(stockMovementMap) : [];
  } catch (err) {
    console.error("❌ getStockMovementsByProductId error:", err);
    return [];
  }
}
