"use client";

interface PurchaseDetailsSectionProps {
  record: any;
}

export function PurchaseDetailsSection({
  record,
}: PurchaseDetailsSectionProps) {
  const hasPurchaseDetails = record.supplierName || record.invoiceNumber;

  if (!hasPurchaseDetails) return null;

  return (
    <div>
      <h4 className="text-xs font-medium text-gray-500 mb-2">
        Purchase Details
      </h4>
      <div className="bg-white p-3 rounded-lg border border-gray-200">
        {record.supplierName && (
          <p className="text-sm font-medium text-gray-800">
            {record.supplierName}
          </p>
        )}
        {record.invoiceNumber && (
          <p className="text-xs text-gray-500">
            Invoice: {record.invoiceNumber}
          </p>
        )}

        <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
          {record.invoiceUnitPrice > 0 && (
            <>
              <div>
                <span className="text-gray-500">Unit Price:</span>
                <p className="font-medium">
                  R{record.invoiceUnitPrice.toFixed(2)}/L
                </p>
              </div>
              <div>
                <span className="text-gray-500">Total Cost:</span>
                <p className="font-medium">
                  R{(record.quantityAdded * record.invoiceUnitPrice).toFixed(2)}
                </p>
              </div>
            </>
          )}
          {record.gridAtPurchase > 0 && (
            <>
              <div>
                <span className="text-gray-500">Selling Price:</span>
                <p className="font-medium">
                  R{record.gridAtPurchase.toFixed(2)}/L
                </p>
              </div>
              <div>
                <span className="text-gray-500">Potential Revenue:</span>
                <p className="font-medium">
                  R{(record.quantityAdded * record.gridAtPurchase).toFixed(2)}
                </p>
              </div>
            </>
          )}
          {record.discount > 0 && (
            <div className="col-span-2">
              <span className="text-gray-500">Discount:</span>
              <p className="font-medium text-green-600">{record.discount}%</p>
            </div>
          )}
        </div>

        {record.invoiceDate && (
          <p className="text-xs text-gray-400 mt-2">
            Invoice Date:{" "}
            {new Date(record.invoiceDate).toLocaleDateString("en-ZA")}
          </p>
        )}
      </div>
    </div>
  );
}
