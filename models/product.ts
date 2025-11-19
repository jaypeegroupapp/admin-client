import { IProduct } from "@/definitions/product";
import mongoose, { Schema, Document, Model, Types } from "mongoose";

interface ProductDocument
  extends Document,
    Omit<IProduct, "id" | "createdAt" | "updatedAt"> {
  categoryId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    sellingPrice: { type: Number, default: 0, min: 0 },
    purchasePrice: { type: Number, default: 0, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", description: "text", tags: 1 });

const Product =
  mongoose.connection.models.Product ||
  mongoose.model<ProductDocument>("Product", ProductSchema);

export default Product;
