// src/definitions/dispenser.ts
import { Types } from "mongoose";

export interface IDispenser {
  id?: string;
  name: string;
  productId: Types.ObjectId | string;
  litres?: number;
  isPublished: boolean;
  userId?: Types.ObjectId | string;
  createdAt?: string;
  updatedAt?: string;
}

export type DispenserFormState = {
  errors: {
    name?: string[];
    productId?: string[];
    litres?: string[];
    isPublished?: string[];
    userId?: string[];
    global?: string[];
  };
  message: string;
};