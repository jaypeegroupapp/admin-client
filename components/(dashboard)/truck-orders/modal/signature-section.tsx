"use client";

import SignatureCanvas from "react-signature-canvas";

export function SignatureSection({
  hasExistingSignature,
  existingSignature,
  canFulfill,
  signature,
  sigPadRef,
  onSignatureChange,
  onClear,
}: any) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        <span>Collector Signature:</span>
        {canFulfill && (
          <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
            Required
          </span>
        )}
      </p>

      {hasExistingSignature && existingSignature && (
        <div className="border border-gray-300 rounded-md bg-white p-3">
          <img
            src={existingSignature}
            className="w-full h-auto object-contain max-h-28"
            alt="Collected signature"
          />
          <p className="text-xs text-gray-400 text-center mt-2">
            ✓ Signature already collected
          </p>
        </div>
      )}

      {!hasExistingSignature && canFulfill && (
        <>
          <div className="border-2 border-dashed border-gray-300 rounded-md bg-white p-2">
            <SignatureCanvas
              ref={sigPadRef}
              penColor="black"
              canvasProps={{
                width: 450,
                height: 140,
                className: "signatureCanvas w-full",
              }}
              onEnd={() => {
                const dataURL = sigPadRef.current
                  ?.getTrimmedCanvas()
                  .toDataURL("image/png");
                onSignatureChange(dataURL);
              }}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <button
              onClick={onClear}
              className="text-xs text-red-600 hover:text-red-700 underline"
            >
              Clear signature
            </button>
            <p className="text-xs text-gray-400">Sign in the box above</p>
          </div>
        </>
      )}
    </div>
  );
}
