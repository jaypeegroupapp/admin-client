// data/mapper.ts

import { IOrderItemAggregated } from "@/definitions/order-item";

export function orderItemMap(i: any): IOrderItemAggregated {
  return {
    id: i._id?.toString(),
    orderId: i.orderId?.toString(),

    productId: i.order?.productId?.toString() || null,
    companyId: i.order?.companyId?.toString() || null,

    quantity: i.quantity,
    status: i.status || "pending",
    signature: i.signature || undefined,

    /** TRUCK DETAILS */
    truckId: i.truckId?.toString(),
    plateNumber: i.truck?.plateNumber || "",
    make: i.truck?.make || "",
    model: i.truck?.model || "",
    year: i.truck?.year || null,

    /** COMPANY */
    companyName: i.company?.companyName || null,

    /** PRODUCT */
    productName: i.product?.name || null,
  };
}

export function mapCompanyCredit(doc: any) {
  return {
    id: doc._id.toString(),
    mineName: doc.mineId?.name || "Unknown Mine",
    creditLimit: doc.creditLimit ?? 0,
    usedCredit: doc.usedCredit ?? 0,
  };
}

