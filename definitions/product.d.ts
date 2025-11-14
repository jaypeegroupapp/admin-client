// src/definitions/product.ts
import { Types } from "mongoose";

export interface IProduct {
  id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: Types.ObjectId | string;
  imageUrl: string;
  isPublished?: boolean;
}

export type ProductFormState = {
  errors: {
    name?: string[];
    description?: string[];
    price?: string[];
    stock?: string[];
    categoryId?: string[];
    imageUrl?: string[];
    global?: string[]; // 👈 added global here
  };
  message: string;
};
