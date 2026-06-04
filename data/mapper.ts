// data/mapper.ts

import { IOrderItemAggregated } from "@/definitions/order-item";
import { IStaff } from "@/definitions/staff";
import { IAction } from "@/definitions/action";
import { IRole } from "@/definitions/role";
import { IDispenser } from "@/definitions/dispenser";
import { ICashTransactionAggregated } from "@/definitions/cash-transactions";

export function orderItemMap(doc: any): IOrderItemAggregated {
  return {
    id: doc._id.toString(),
    orderId: doc.orderId?.toString(),
    orderNumber: doc.order?.orderNumber,
    productId: doc.product?._id?.toString(),
    productName: doc.product?.name,
    companyId: doc.companyId?._id?.toString(),
    companyName: doc.company?.name,
    truckId: doc.truck?._id?.toString(),
    plateNumber: doc.truck?.plateNumber,
    make: doc.truck?.make,
    model: doc.truck?.model,
    year: doc.truck?.year,
    quantity: doc.quantity,
    status: doc.status,
    signature: doc.signature,
    createdAt: doc.createdAt?.toISOString(),
    updatedAt: doc.updatedAt?.toISOString(),
    completedAt: doc.updatedAt?.toISOString(),

    // Dispenser and fulfillment info
    dispenserId:
      doc.dispenserId?._id?.toString() || doc.dispenserId?.toString(),
    dispenserName: doc.dispenserId?.name,
    attendanceId:
      doc.attendanceId?._id?.toString() || doc.attendanceId?.toString(),
    attendantName: doc.attendanceId?.attendantId?.name,
    meterReading: doc.balanceAfter || doc.attendanceId?.totalDispensed,
    tankerName: doc.tankerName || "Unknown",
    tankerStockLevel: doc.tankerStockLevel || 0,
  };
}
export function mapCompanyCredit(doc: any) {
  return {
    id: doc._id.toString(),
    mineName: doc.mineId?.name || "Unknown Mine",
    creditLimit: doc.creditLimit ?? 0,
    usedCredit: doc.usedCredit ?? 0,
    isActive: doc.isActive ?? false,
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

export function mapRole(doc: any): IRole {
  return {
    id: doc._id.toString(),
    name: doc.name,
    description: doc.description,
  };
}

export function mapDispenserUsage(doc: any): any {
  return {
    id: doc._id.toString(),
    dispenserId: doc.dispenserId.toString(),
    litresDispensed: doc.litresDispensed,
    timestamp: doc.timestamp?.toISOString(),
    orderId: doc.orderId?.toString(),
    createdAt: doc.createdAt?.toISOString(),
  };
}

// src/data/mapper.ts
export function cashTransactionMap(doc: any): ICashTransactionAggregated {
  return {
    id: doc._id.toString(),
    companyName: doc.companyName,
    productName: doc.productName || "Diesel",
    plateNumber: doc.plateNumber,
    driverName: doc.driverName,
    phoneNumber: doc.phoneNumber,
    grid: doc.grid,
    plusDiscount: doc.plusDiscount,
    litres: doc.litresPurchased,
    total: doc.total,
    status: doc.status,
    createdAt: doc.createdAt?.toISOString(),
    dispenserName: doc.dispenserId?.name,
    attendantName: doc.completedById?.name,
  };
}
