"use client";

export function SupplierInvoiceStockMovements({
  stockMovements,
}: {
  stockMovements: any[];
}) {
  if (!stockMovements?.length) {
    return (
      <p className="text-gray-500 text-center py-10">
        No stock movement records.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {stockMovements.map((sm: any) => (
        <div
          key={sm.id}
          className="bg-white rounded-xl border p-4 shadow-sm text-sm"
        >
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">Product</p>
              <p className="font-semibold">{sm.productName}</p>
            </div>

            <div>
              <p className="text-gray-500">Quantity</p>
              <p className="font-semibold">{sm.quantity}</p>
            </div>

            <div>
              <p className="text-gray-500">Purchase Price</p>
              <p className="font-semibold">R{sm.purchasePrice}</p>
            </div>

            <div>
              <p className="text-gray-500">Total</p>
              <p className="font-semibold">
                R{(sm.quantity * sm.purchasePrice).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
