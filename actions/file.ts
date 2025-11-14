"use server";

import { connectDB } from "@/lib/db";
import mongoose, { Types } from "mongoose";
import { Readable } from "stream";
import { randomUUID } from "crypto";

// Allowed file types for invoices
const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function uploadFile(formData: FormData) {
  const file = formData.get("file") as File;

  if (!file) {
    return { success: false, message: "No file provided" };
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const { gfs } = await connectDB();
  const uploadStream = gfs.openUploadStream(file.name, {
    contentType: file.type,
  });

  uploadStream.end(buffer);

  return { success: true, filename: file.name };
}

export async function uploadDoc(formData: FormData) {
  const file = formData.get("file") as File;

  if (!file) {
    return { success: false, message: "No file provided" };
  }

  // ✅ 1. Validate file type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      success: false,
      message: "Invalid file type. Only PDF, JPG, or PNG allowed.",
    };
  }

  // ✅ 2. Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      message: "File too large. Maximum allowed size is 5MB.",
    };
  }

  // ✅ 3. Convert file to buffer for Mongo upload
  const buffer = Buffer.from(await file.arrayBuffer());

  // ✅ 4. Save to GridFS
  const { gfs } = await connectDB();

  const uniqueFilename = `${randomUUID()}-${file.name}`;

  const uploadStream = gfs.openUploadStream(uniqueFilename, {
    contentType: file.type,
  });

  uploadStream.end(buffer);

  // ✅ 5. Wait until upload is complete
  await new Promise<void>((resolve, reject) => {
    uploadStream.on("finish", () => resolve());
    uploadStream.on("error", (err: any) => reject(err));
  });

  // ✅ 6. Return metadata for DB reference
  return {
    success: true,
    filename: uploadStream.id.toString(),
    message: "File uploaded successfully",
  };
}

export async function deleteFileAction(fileId: string) {
  try {
    const { gfs } = await connectDB();

    // Ensure valid ObjectId
    const objectId = new Types.ObjectId(fileId);

    await gfs.delete(objectId);

    return { success: true };
  } catch (err) {
    console.error("Delete error:", err);
    return { success: false, error: "Failed to delete file" };
  }
}

export async function deleteFileByNameAction(filename: string) {
  try {
    const { gfs } = await connectDB();

    // Find file metadata by filename
    const filesCollection = mongoose.connection.db?.collection("uploads.files");
    const fileDoc = filesCollection
      ? await filesCollection.findOne({
          filename,
        })
      : null;

    if (!fileDoc?._id) {
      return { success: false, error: "File not found" };
    }

    // Delete file by _id
    await gfs.delete(fileDoc._id);

    return { success: true };
  } catch (err) {
    console.error("Delete error:", err);
    return { success: false, error: "Failed to delete file" };
  }
}
