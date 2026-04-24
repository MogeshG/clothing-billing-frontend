import { useMemo, useState } from "react";
import { type MRT_ColumnDef } from "material-react-table";
import { useDispatch } from "react-redux";
import { Alert, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useBatches } from "../../../hooks/useBatches";
import type { Batch } from "../../../types/batch";
import { CustomTable } from "../../../components/CustomTable";
import type { AppDispatch } from "../../../store";
import formatRupee from "../../../utils/formatRupee";
import { useNavigate } from "react-router-dom";

const BatchesPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { batches, loading, error, clearError } = useBatches();

  const [columnPinning, setColumnPinning] = useState({
    left: ["mrt-row-expand", "mrt-row-select", "batchNo"],
    right: ["mrt-row-actions"],
  });

  const columns = useMemo<MRT_ColumnDef<Batch>[]>(
    () => [
      {
        accessorKey: "batchNo",
        header: "Batch No",
      },
      {
        accessorKey: "productName",
        header: "Product",
      },
      {
        accessorKey: "variantSku",
        header: "Variant SKU",
        Cell: ({ renderedCellValue }) => renderedCellValue ?? "-",
      },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ row }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${row.original.status === "ACTIVE"
              ? "bg-green-100 text-green-800"
              : row.original.status === "PENDING"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
              }`}
          >
            {row.original.status}
          </span>
        ),
      },
      {
        accessorKey: "purchaseNo",
        header: "Purchase No",
      },
      {
        accessorKey: "vendorName",
        header: "Vendor",
      },
      {
        accessorKey: "remainingQuantity",
        header: "Available Quantity",
      },

      {
        accessorKey: "purchasePrice",
        header: "Purchase Price",
        Cell: ({ renderedCellValue }) => {
          const value = Number(renderedCellValue);

          return isFinite(value) ? formatRupee(value) : "";
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        Cell: ({ renderedCellValue }) =>
          new Date(renderedCellValue as string).toLocaleDateString(),
      },
    ],
    [],
  );

  const renderRowActions = ({ row }) => (
    <div className="flex gap-1">
      {row.original.status !== "ACTIVE" && <IconButton
        onClick={() => {
          navigate(`/batches/update-batch/${row.original.id}`);
        }}
        size="small"
        sx={{
          border: "1px solid",
          borderColor: "primary.main",
          color: "primary.main",
          borderRadius: 1,
          width: 36,
          height: 36,
        }}
      >
        <EditIcon fontSize="small" />
      </IconButton>}
    </div>
  );

  return (
    <div className="flex flex-col w-full space-y-4 p-3 overflow-y-auto">
      <h1 className="text-3xl font-bold text-gray-800">Batches</h1>
      {error && (
        <Alert severity="error" onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}
      <CustomTable
        columns={columns}
        data={batches}
        isLoading={loading}
        enableRowActions
        renderRowActions={renderRowActions}
        enableColumnPinning
        enableRowSelection={false}
        columnPinning={columnPinning}
        onColumnPinningChange={setColumnPinning}
      />
    </div>
  );
};

export default BatchesPage;
