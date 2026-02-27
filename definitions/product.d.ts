// src/definitions/product.ts
import { Types } from "mongoose";

export interface IProduct {
  id?: string;
  name: string;
  description: string;
  grid?: number;
  discount?: number;
  stock?: number;
  categoryId?: Types.ObjectId | string;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type ProductFormState = {
  errors: {
    name?: string[];
    description?: string[];
    global?: string[]; // 👈 added global here
  };
  message: string;
};
