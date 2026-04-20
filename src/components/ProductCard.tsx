import React from "react";
import Stepper from "./CustomStepper";
import { type Batch } from "../types/batch";
import type { ItemForm } from "../pages/private/pos/ItemForm";
import formatRupee from "../utils/formatRupee";
import dayjs from "dayjs";

interface ProductCardProps {
  batch: Batch;
  items: ItemForm[];
  onAdd: (batch: Batch, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ batch, items, onAdd }) => {
  const existingItem = items.find((item) => item.batchNo === batch.batchNo);
  const syncedQuantity = existingItem ? existingItem.quantity : 0;
  const [quantity, setQuantity] = React.useState(syncedQuantity);

  React.useEffect(() => {
    if (existingItem) {
      setQuantity(existingItem.quantity);
    } else {
      setQuantity(0);
    }
  }, [existingItem]);

  return (
    <div className="p-3 bg-white rounded-lg border shadow-sm hover:shadow-md transition-all cursor-pointer group">
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col">
          <h3 className="font-semibold text-sm line-clamp-1">{batch.productName}</h3>
          <span className="text-xs text-gray-500">Batch: {batch.batchNo}</span>
          {batch.expiryDate && (
            <span className="text-xs text-orange-600">
              Exp: {dayjs(batch.expiryDate).format("MMM DD, YYYY")}
            </span>
          )}
        </div>
        <div className="text-right">
          <span className="font-bold text-lg block">{formatRupee(batch.sellingPrice)}</span>
          <span className="text-xs text-gray-500">Stock: {batch.remainingQuantity}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2 justify-center">
        <Stepper
          value={quantity}
          min={0}
          max={batch.remainingQuantity}
          onChange={(val) => {
            setQuantity(val);
            onAdd(batch, val);
          }}
          onIncrease={() => {
            const newQty = Math.min(quantity + 1, batch.remainingQuantity);
            setQuantity(newQty);
            onAdd(batch, newQty);
          }}
          onDecrease={() => {
            const newQty = Math.max(quantity - 1, 0);
            setQuantity(newQty);
            onAdd(batch, newQty);
          }}
        />
      </div>
    </div>
  );
};

export default ProductCard;
