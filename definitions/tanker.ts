import { Types } from "mongoose";

export interface ITanker {
  id?: string;
  name: string;
  productId: Types.ObjectId | string;
  productName?: string;
  stockLevel: number; // Current stock in litres
  capacity: number; // Maximum capacity in litres
  isPublished: boolean;
  userId?: Types.ObjectId | string;
  attendanceName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type TankerFormState = {
  errors: {
    name?: string[];
    productId?: string[];
    stockLevel?: string[];
    capacity?: string[];
    isPublished?: string[];
    userId?: string[];
    global?: string[];
  };
  message: string;
};
