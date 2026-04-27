import React, { useCallback, useRef, useEffect } from "react";
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
  const existingItem = items.find(
    (item) =>
      (item.batchNo && item.batchNo === batch.batchNo) ||
      (!item.batchNo && item.variantSku === batch.variantSku),
  );

  const syncedQuantity = existingItem ? existingItem.quantity : 0;
  const [quantity, setQuantity] = React.useState(syncedQuantity);

  const timeoutRef = useRef<number>(null);
  const existingQuantityRef = useRef(syncedQuantity);

  useEffect(() => {
    existingQuantityRef.current = syncedQuantity;
  }, [syncedQuantity]);

  const debouncedOnAdd = useCallback(
    (newQty: number) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = window.setTimeout(() => {
        if (existingQuantityRef.current !== newQty) {
          onAdd(batch, newQty);
        }
      }, 120);
    },
    [batch, onAdd],
  );

  useEffect(() => {
    setQuantity(syncedQuantity);
  }, [syncedQuantity]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const isExpiringSoon =
    batch.expiryDate && dayjs(batch.expiryDate).diff(dayjs(), "day") <= 7;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 group">
      {/* Header */}
      <div className="flex justify-between gap-3">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
            {batch.productName}
          </h3>

          <div className="flex flex-col gap-0.5 mt-1">
            <span className="text-[11px] text-gray-600">
              Batch: {batch.batchNo}
            </span>

            {batch.expiryDate && (
              <span
                className={`text-[11px] ${
                  isExpiringSoon ? "text-red-600" : "text-orange-600"
                }`}
              >
                Exp: {dayjs(batch.expiryDate).format("DD MMM")}
              </span>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="text-right">
          <div className="flex flex-col items-end">
            <p className="text-lg font-bold text-gray-900 leading-tight">
              {formatRupee(batch.sellingPrice)}
            </p>
            {batch.mrp > batch.sellingPrice && (
              <p className="text-[11px] text-gray-400 line-through">
                {formatRupee(batch.mrp)}
              </p>
            )}
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            Stock: {batch.remainingQuantity}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="my-3 border-t border-gray-100" />

      {/* Stepper Section */}
      <div className="flex items-center justify-center">
        <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
          <Stepper
            value={quantity}
            min={0}
            max={batch.remainingQuantity + syncedQuantity}
            onChange={(val) => {
              setQuantity(val);
              debouncedOnAdd(val);
            }}
            onIncrease={() => {
              const newQty = Math.min(quantity + 1, batch.remainingQuantity);
              if (newQty > quantity) {
                setQuantity(newQty);
                debouncedOnAdd(newQty);
              }
            }}
            onDecrease={() => {
              const newQty = Math.max(quantity - 1, 0);
              if (newQty < quantity) {
                setQuantity(newQty);
                debouncedOnAdd(newQty);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
