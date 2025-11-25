"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { productFormSchema } from "@/validations/product";
import {
  createProductService,
  updateProductService,
  deleteProductService,
  getProductByIdService,
  updateProductPublishStatusService,
} from "@/services/product";
import { IProduct } from "@/definitions/product";

export async function createProductAction(
  productId: string,
  prevState: any,
  formData: FormData
) {
  try {
    const validated = productFormSchema.safeParse(Object.fromEntries(formData));

    if (!validated.success) {
      console.log(validated.error.flatten().fieldErrors);
      return {
        message: "Validation failed",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const data = validated.data as IProduct;

    if (productId) {
      const existingProduct = await getProductByIdService(productId);
      if (!existingProduct) {
        return {
          message: "Product not found",
          errors: { global: "Invalid product ID" },
        };
      }
      await updateProductService(productId, data);
    } else {
      await createProductService(data);
    }
  } catch (error: any) {
    console.error("❌ createProductAction error:", error);
    return {
      message: "Failed to create or update product",
      errors: { global: error.message },
    };
  }

  let url = productId ? `/products/${productId}` : "/products";
  revalidatePath(url);
  redirect(url);
}

export async function deleteProductAction(productId: string) {
  try {
    await deleteProductService(productId);
    revalidatePath("/products");

    return { success: true, message: "Product deleted successfully." };
  } catch (error: any) {
    console.error("❌ deleteProductAction error:", error);
    return { success: false, message: "Failed to delete product." };
  }
}

export async function updateProductPublishStatusAction(
  productId: string,
  isPublished: boolean
) {
  try {
    await updateProductPublishStatusService(productId, isPublished);
    revalidatePath("/products");

    return { success: true, message: "Product updated successfully." };
  } catch (err) {
    console.error("❌ updateProductPublishStatusAction error:", err);
    return { success: false, message: "Failed to update product status." };
  }
}
