import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";

const CACHE_STRATEGY = {
  mutable: "public, max-age=3600",
  immutable: "public, max-age=31536000, immutable",
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  try {
    const { gfs } = await connectDB();
    const filesCollection = mongoose.connection.db?.collection("uploads.files");

    if (!filesCollection) {
      return new Response("File not found", { status: 404 });
    }

    let fileDoc = await filesCollection.findOne({ filename });

    let useIdLookup = false;
    let fileId: any = null;

    // If not found by filename → try looking up by ObjectId
    if (!fileDoc) {
      try {
        fileId = new mongoose.Types.ObjectId(filename);
        fileDoc = await filesCollection.findOne({ _id: fileId });

        if (!fileDoc) {
          return new Response("File not found", { status: 404 });
        }

        useIdLookup = true;
      } catch {
        return new Response("File not found", { status: 404 });
      }
    }

    const contentType = fileDoc.contentType || "application/octet-stream";
    const lastModified = fileDoc.uploadDate?.toUTCString();
    const etag = `"${fileDoc._id.toString()}-${fileDoc.length}"`;

    // Cache checks
    const ifNoneMatch = req.headers.get("if-none-match");
    const ifModifiedSince = req.headers.get("if-modified-since");

    if (
      ifNoneMatch === etag ||
      (ifModifiedSince && new Date(ifModifiedSince) >= fileDoc.uploadDate)
    ) {
      return new Response(null, {
        status: 304,
        headers: {
          ETag: etag,
          "Last-Modified": lastModified,
          "Cache-Control": getCacheHeader(filename),
        },
      });
    }

    // Stream the file (by name OR id)
    const downloadStream = useIdLookup
      ? gfs.openDownloadStream(fileId)
      : gfs.openDownloadStreamByName(filename);

    const stream = new ReadableStream({
      async pull(controller) {
        for await (const chunk of downloadStream) {
          controller.enqueue(chunk);
        }
        controller.close();
      },
    });

    const safeFilename = fileDoc.filename.replace(/[^\x20-\x7E]/g, "_"); // fallback ASCII
    const encodedFilename = encodeURIComponent(fileDoc.filename); // UTF-8 encoded

    return new Response(stream, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${safeFilename}"; filename*=UTF-8''${encodedFilename}`,
        "Cache-Control": getCacheHeader(filename),
        ETag: etag,
        "Last-Modified": lastModified,
        "X-Content-Type": contentType, // <-- add this
      },
    });
  } catch (err) {
    console.error("❌ Document fetch error:", err);
    return new Response("File not found", { status: 404 });
  }
}

function getCacheHeader(filename: string) {
  return filename.match(/[a-f0-9]{6,}/)
    ? CACHE_STRATEGY.immutable
    : CACHE_STRATEGY.mutable;
}
