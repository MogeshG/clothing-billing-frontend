import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { MRT_ColumnDef } from "material-react-table";
import { Add } from "@mui/icons-material";
import { useStockAdjustments } from "../../../hooks/useStockAdjustments";
import { CustomTable } from "../../../components/CustomTable";
import CustomButton from "../../../components/CustomButton";
import type { AppDispatch } from "../../../store";
import { clearError } from "../../../slices/stockAdjustmentsSlice";
import type { StockAdjustment } from "../../../types/stockAdjustment";
import { Alert } from "@mui/material";

const StockAdjustmentsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { adjustments, loading, error } = useStockAdjustments();

  const columns = React.useMemo<MRT_ColumnDef<StockAdjustment>[]>(
    () => [
      {
        accessorKey: "createdAt",
        header: "Date",
        Cell: ({ renderedCellValue }) =>
          new Date(renderedCellValue as string).toLocaleDateString(),
        size: 120,
      },
      {
        accessorKey: "productName",
        header: "Product",
        size: 200,
      },
      {
        accessorKey: "batchNo",
        header: "Batch No",
        size: 120,
      },
      {
        accessorKey: "type",
        header: "Type",
        Cell: ({ row }) => (
          <span
            className={`px-2 py-1 rounded text-xs font-bold ${
              row.original.type === "+"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {row.original.type === "+" ? "Increase" : "Decrease"}
          </span>
        ),
        size: 100,
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
        size: 120,
      },
      {
        accessorKey: "reason",
        header: "Reason",
        size: 150,
      },
      {
        accessorKey: "createdBy",
        header: "Created By",
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col w-full space-y-4 p-3 overflow-y-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Stock Adjustments</h1>
        <div className="flex gap-2">
          <CustomButton
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/stock-adjustments/new-adjustment")}
          >
            New Adjustment
          </CustomButton>
        </div>
      </div>

      {error && (
        <Alert severity="error" onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      <CustomTable
        columns={columns}
        data={adjustments}
        isLoading={loading}
        enablePagination
        enableGlobalFilter
        enableColumnFilters
        enableRowSelection={false}
      />
    </div>
  );
};

export default StockAdjustmentsPage;
