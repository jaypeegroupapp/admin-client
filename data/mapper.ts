// data/mapper.ts

import { IOrderItemAggregated } from "@/definitions/order-item";
import { IStaff } from "@/definitions/staff";
import { IAction } from "@/definitions/action";

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
    companyName: i.company?.name || null,

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

/* ---------------------------------------------------------
 * MAPPER
 * ---------------------------------------------------------*/
export function companyCreditApprovalMap(a: any) {
  return {
    id: a._id?.toString(),

    companyCreditId: a.companyCreditId?.toString() || null,
    creditLimit: a.creditLimit,
    requester: a.requester,
    reason: a.reason,
    status: a.status,
    document: a.document || null,

    createdAt: a.createdAt,
    updatedAt: a.updatedAt,

    /** COMPANY CREDIT → BASE */
    baseCreditLimit: a.credit?.creditLimit || null,
    usedCredit: a.credit?.usedCredit || null,

    /** COMPANY */
    companyId: a.credit?.companyId?.toString() || null,
    companyName: a.company?.name || null,

    /** MINE */
    mineId: a.credit?.mineId?.toString() || null,
    mineName: a.mine?.name || null,
  };
}

// data/mapper.ts
export function mapOrder(order: any) {
  return {
    id: order._id.toString(),
    userId: order.userId?._id?.toString() || "",
    userName: order.userId?.fullName || "",
    mineId: order.mineId?._id?.toString() || "",
    mineName: order.mineId?.name || "",
    companyId: order.companyId?._id?.toString() || "",
    companyName: order.companyId?.name || "",
    productId: order.productId?._id?.toString() || "",
    productName: order.productId?.name || "N/A",
    totalAmount: Number(order.totalAmount || 0),
    debit: Number(order.debit || 0),
    credit: Number(order.credit || 0),
    collectionDate: order.collectionDate
      ? new Date(order.collectionDate).toISOString()
      : "",
    status: order.status || "pending",
    createdAt: order.createdAt ? new Date(order.createdAt).toISOString() : "",
    updatedAt: order.updatedAt ? new Date(order.updatedAt).toISOString() : "",
  };
}

/** Mapper (same idea as mapMine) */
export function mapStaff(doc: any): IStaff {
  return {
    id: doc._id.toString(),
    name: doc.name,
    status: doc.status,
    userId: doc.userId?.toString(),
    mines: doc.mines?.map((m: any) => m.toString()) || [],
  };
}

export function mapAction(doc: any): IAction {
  return {
    id: doc._id.toString(),
    name: doc.name,
    resource: doc.resource,
    description: doc.description,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}
