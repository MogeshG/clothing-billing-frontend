import { useCallback, useMemo, useState } from "react";
import type { MRT_ColumnDef } from "material-react-table";
import { useDispatch } from "react-redux";
import { Alert, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteBatch, clearError } from "../../../slices/inventorySlice";
import { useInventory } from "../../../hooks/useInventory";
import type { Inventory } from "../../../types/inventory";
import CustomButton from "../../../components/CustomButton";
import { CustomTable } from "../../../components/CustomTable";
import type { AppDispatch } from "../../../store";
import { DeleteOutlined, EditOutlined } from "@mui/icons-material";

const Inventory = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { inventory, loading, error, refetch } = useInventory();

  const [columnPinning, setColumnPinning] = useState({
    left: ["mrt-row-select", "product.name"], // pinned to left
    right: ["mrt-row-actions"], // pinned to right
  });

  // Row selection for bulk delete
  // Row selection handled by MRT internal state

  const handleBulkDelete = useCallback(
    async (selectedIds: string[]) => {
      if (selectedIds.length > 0) {
        try {
          await Promise.all(
            selectedIds.map((id) => dispatch(deleteBatch(id)).unwrap()),
          );
          refetch();
        } catch (err) {
          console.error("Bulk delete failed", err);
        }
      }
    },
    [dispatch, refetch],
  );

  const columns = useMemo<MRT_ColumnDef<Inventory>[]>(
    () => [
      {
        accessorKey: "batchNo",
        header: "Batch No",
      },
      {
        accessorKey: "product.name",
        header: "Product",
      },
      {
        accessorKey: "variant.size",
        header: "Size",
      },
      {
        accessorKey: "variant.color",
        header: "Color",
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
      },
      {
        accessorKey: "remainingQuantity",
        header: "Remaining",
      },
      {
        accessorKey: "purchasePrice",
        header: "Purchase Price",
      },
      {
        accessorKey: "sellingPrice",
        header: "Selling Price",
      },
      {
        accessorKey: "expiryDate",
        header: "Expiry",
        Cell: ({ renderedCellValue }) =>
          renderedCellValue
            ? new Date(renderedCellValue as string).toLocaleDateString()
            : "N/A",
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col w-full space-y-4 p-3 overflow-y-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Inventory</h1>
        <div className="flex gap-2">
          <CustomButton
            variant="contained"
            startIcon={<AddIcon />}
            // TODO: Add dialog
            onClick={() => console.log("Add inventory")}
          >
            Add Batch
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
        data={inventory}
        isLoading={loading}
        enableRowSelection
        enableRowActions
        enableColumnPinning
        columnPinning={columnPinning}
        onColumnPinningChange={setColumnPinning}
        renderTopToolbarCustomActions={({ table }) => {
          const selectedRows = table.getSelectedRowModel().rows;
          const selectedIds = selectedRows.map((row) => row.original.id);
          return selectedIds.length > 0 ? (
            <CustomButton
              variant="contained"
              className="bg-red-500! hover:bg-red-600! text-white"
              size="small"
              onClick={() => handleBulkDelete(selectedIds)}
              startIcon={<DeleteIcon />}
            >
              Delete Selected ({selectedIds.length})
            </CustomButton>
          ) : null;
        }}
        renderRowActions={({ row }) => (
          <div className="flex gap-1">
            <IconButton
              // TODO: Edit dialog
              onClick={() => console.log("Edit", row.original)}
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
              <EditOutlined fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() =>
                dispatch(deleteBatch(row.original.id)).unwrap().then(refetch)
              }
              sx={{
                border: 1,
                borderColor: "error.main",
                borderRadius: 1,
                color: "error.main",
                width: 36,
                height: 36,
              }}
            >
              <DeleteOutlined fontSize="small" />
            </IconButton>
          </div>
        )}
      />

      {/* Dialog placeholders TODO */}
    </div>
  );
};

export default Inventory;
