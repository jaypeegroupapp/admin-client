"use client";

import { useEffect, useState } from "react";
import { BaseModal } from "@/components/ui/base-modal";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export function ViewDocumentModal({ open, onClose, documentUrl }: any) {
  const [contentType, setContentType] = useState<string | null>(null);

  useEffect(() => {
    async function fetchType() {
      if (!documentUrl) return;

      const res = await fetch(documentUrl, { method: "HEAD" });
      const type =
        res.headers.get("X-Content-Type") || "application/octet-stream";
      setContentType(type);
    }

    fetchType();
  }, [documentUrl]);

  const isImage = contentType?.startsWith("image/");
  const isPdf = contentType === "application/pdf";
  const isViewableInline = isImage || isPdf;

  const isWordDoc =
    contentType === "application/msword" ||
    contentType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  return (
    <BaseModal open={open} onClose={onClose} maxWidth="max-w-6xl">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Attached Document
      </h3>

      {/* Loading */}
      {!contentType && (
        <div className="text-center py-10 text-gray-500">Loading document…</div>
      )}

      {/* --- IMAGE VIEWER WITH ZOOM/PAN --- */}
      {contentType && isImage && (
        <div className="w-full h-[85vh] overflow-hidden rounded-md bg-gray-50 flex items-center justify-center">
          <TransformWrapper
            initialScale={1}
            wheel={{ step: 0.2 }}
            pinch={{ step: 5 }}
            doubleClick={{ disabled: true }}
          >
            <TransformComponent>
              <img
                src={documentUrl}
                alt="Document"
                className="max-w-full max-h-full object-contain"
              />
            </TransformComponent>
          </TransformWrapper>
        </div>
      )}

      {/* --- PDF VIEW --- */}
      {contentType && isPdf && (
        <iframe
          src={documentUrl}
          className="w-full h-[85vh] border rounded-md"
        ></iframe>
      )}

      {/* --- WORD DOC --- */}
      {contentType && isWordDoc && (
        <div className="text-center py-10">
          <p className="text-gray-600 mb-4">
            Word documents cannot be previewed. Click below to download and
            open.
          </p>
          <a
            href={documentUrl}
            download
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Download Document
          </a>
        </div>
      )}

      {/* --- UNKNOWN TYPES --- */}
      {contentType && !isViewableInline && !isWordDoc && (
        <div className="text-center py-10">
          <p className="text-gray-600 mb-4">
            This file type cannot be previewed. Please check your downloads.
          </p>
          <a
            href={documentUrl}
            download
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Download File
          </a>
        </div>
      )}

      <div className="flex justify-end mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100"
        >
          Close
        </button>
      </div>
    </BaseModal>
  );
}
