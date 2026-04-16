/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useMemo } from "react";
import type { MRT_ColumnDef } from "material-react-table";
import { useDispatch } from "react-redux";
import { Alert, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  deleteProductCategories,
  clearError,
} from "../../../slices/productCategoriesSlice";
import { useProductCategories } from "../../../hooks/useProductCategories";
import type { ProductCategory } from "../../../types/productCategory";
import CustomButton from "../../../components/CustomButton";
import AddProductCategoryDialog from "./AddProductCategoryDialog";
import EditProductCategoryDialog from "./EditProductCategoryDialog";
import DeleteProductCategoryDialog from "./DeleteProductCategoryDialog";
import { CustomTable } from "../../../components/CustomTable";
import type { AppDispatch } from "../../../store";
import { DeleteOutlined, EditOutlined } from "@mui/icons-material";

const ProductCategoriesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { productCategories, loading, error, refetch } = useProductCategories();

  // Modals state
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const [columnPinning, setColumnPinning] = useState({
    left: ["mrt-row-select", "name"],
    right: ["mrt-row-actions"],
  });

  const handleBulkDelete = useCallback(
    async ({ table }: { table: any }) => {
      const selectedIds = table
        .getSelectedRowModel()
        .rows.map((row: any) => row.original.id);
      if (selectedIds.length > 0) {
        try {
          await dispatch(deleteProductCategories(selectedIds)).unwrap();
          table.resetRowSelection();
          refetch();
        } catch (err) {
          console.error("Bulk delete failed", err);
        }
      }
    },
    [dispatch, refetch],
  );

  const columns = useMemo<MRT_ColumnDef<ProductCategory>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "description",
        header: "Description",
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

  return (
    <div className="flex flex-col w-full space-y-4 p-3 overflow-y-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Product Categories</h1>
        <CustomButton
          startIcon={<AddIcon />}
          onClick={() => setOpenAddModal(true)}
        >
          Add Category
        </CustomButton>
      </div>

      {error && (
        <Alert severity="error" onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}
      <CustomTable
        columns={columns}
        data={productCategories}
        isLoading={loading}
        enableColumnPinning
        columnPinning={columnPinning}
        onColumnPinningChange={setColumnPinning}
        enableRowSelection
        enableRowActions
        renderRowActions={({ row }) => (
          <div className="flex gap-1">
            <IconButton
              onClick={() => {
                setSelectedCategoryId(row.original.id);
                setOpenEditModal(true);
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
              <EditOutlined fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => {
                setSelectedCategoryId(row.original.id);
                setOpenDeleteDialog(true);
              }}
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
        renderTopToolbarCustomActions={({ table }) => {
          const selectedRows = table.getSelectedRowModel().rows;

          return selectedRows.length > 0 ? (
            <CustomButton
              variant="contained"
              className="bg-red-500! hover:bg-red-600! text-white"
              size="small"
              onClick={() => handleBulkDelete({ table })}
              startIcon={<DeleteIcon />}
            >
              Delete Selected ({selectedRows.length})
            </CustomButton>
          ) : null;
        }}
      />

      <AddProductCategoryDialog
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
      />
      <EditProductCategoryDialog
        open={openEditModal}
        categoryId={selectedCategoryId || null}
        onClose={() => setOpenEditModal(false)}
      />
      <DeleteProductCategoryDialog
        open={openDeleteDialog}
        categoryId={selectedCategoryId || null}
        onClose={() => setOpenDeleteDialog(false)}
      />
    </div>
  );
};

export default ProductCategoriesPage;
