/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useMemo } from "react";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { useDispatch } from "react-redux";
import { Alert, IconButton, ButtonGroup, Snackbar } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { deleteProducts, clearError } from "../../../slices/productsSlice";
import { useProducts } from "../../../hooks/useProducts";
import type { Product, ProductVariant } from "../../../types/product";
import CustomButton from "../../../components/CustomButton";
import { CustomTable } from "../../../components/CustomTable";
import BulkProductDialog from "./BulkProductDialog";
import DeleteProductDialog from "./DeleteProductDialog";
import type { AppDispatch } from "../../../store";
import {
  DeleteOutlined,
  EditOutlined,
  FileDownload,
} from "@mui/icons-material";
import {
  exportTableToExcel,
  type ExportColumn,
} from "../../../utils/exportTableToExcel";
import { useNavigate } from "react-router-dom";
import PermissionGuard from "../../../components/PermissionGuard";

const ProductsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error, refetch } = useProducts();

  // State for dialogs and standalone actions
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );

  const [columnPinning, setColumnPinning] = useState({
    left: ["mrt-row-expand", "mrt-row-select", "name"], // pinned to left
    right: ["mrt-row-actions"], // pinned to right
  });

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleBulkUpload = useCallback(() => {
    setBulkDialogOpen(true);
  }, []);

  const handleBulkDelete = useCallback(
    async ({ table }: { table: any }) => {
      const selectedIds = table
        .getSelectedRowModel()
        .rows.map((row: any) => row.original.id);
      if (selectedIds.length > 0) {
        try {
          await dispatch(deleteProducts(selectedIds)).unwrap();
          table.resetRowSelection();
          refetch();
          showSnackbar(`Deleted ${selectedIds.length} products`);
        } catch (err) {
          showSnackbar("Bulk delete failed");
          console.error("Bulk delete failed", err);
        }
      }
    },
    [dispatch, refetch],
  );

  const handleExportExcel = useCallback(
    async (table: any) => {
      const selectedRows = table.getSelectedRowModel().rows;
      const rowsToExport =
        selectedRows.length > 0
          ? selectedRows.map((row: any) => row.original)
          : products;

      const visibleColumns = table
        .getVisibleLeafColumns()
        .filter(
          (col: any) =>
            !col.id?.startsWith("mrt-") && col.columnDef?.accessorKey,
        );

      const exportColumns: ExportColumn[] = visibleColumns.map((col: any) => ({
        header: col.columnDef.header as string,
        accessorKey: col.columnDef.accessorKey as string,
        formatter:
          col.columnDef.accessorKey === "createdAt"
            ? (value: unknown) => new Date(value as string).toLocaleDateString()
            : undefined,
      }));

      await exportTableToExcel("products.xlsx", exportColumns, rowsToExport);
    },
    [products],
  );

  const columns = useMemo<MRT_ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "sku",
        header: "SKU",
        Cell: ({ renderedCellValue }) => renderedCellValue ?? "-",
      },
      {
        accessorKey: "hsnCode",
        header: "HSN Code",
      },
      {
        accessorKey: "brand",
        header: "Brand",
        Cell: ({ renderedCellValue }) => renderedCellValue ?? "-",
      },
      {
        accessorKey: "categoryName",
        header: "Category",
        Cell: ({ row }) => `${row.original.categoryName}`,
      },
      {
        accessorKey: "gstPercent",
        header: "GST %",
        Cell: ({ row }) =>
          `${Number(row.original.cgstPercent) + Number(row.original.sgstPercent)}%`,
      },
      {
        accessorKey: "taxInclusive",
        header: "Tax Inclusive",
        Cell: ({ row }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              row.original.taxInclusive
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {row.original.taxInclusive ? "Yes" : "No"}
          </span>
        ),
      },
      {
        accessorKey: "isActive",
        header: "Active",
        Cell: ({ row }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              row.original.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {row.original.isActive ? "Yes" : "No"}
          </span>
        ),
      },
      {
        id: "variantCount",
        header: "Variants",
        Cell: ({ row }) => row.original.variant?.length ?? 0,
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

  const variantColumns = useMemo<MRT_ColumnDef<ProductVariant>[]>(
    () => [
      {
        accessorKey: "size",
        header: "Size",
      },
      {
        accessorKey: "color",
        header: "Color",
      },
      {
        accessorKey: "sku",
        header: "SKU",
        Cell: ({ renderedCellValue }) => renderedCellValue ?? "-",
      },
      {
        accessorKey: "barcode",
        header: "Barcode",
      },
      {
        accessorKey: "costPrice",
        header: "Cost Price",
        Cell: ({ renderedCellValue }) => `₹${renderedCellValue}`,
      },
      {
        accessorKey: "sellingPrice",
        header: "Selling Price",
        Cell: ({ renderedCellValue }) => `₹${renderedCellValue}`,
      },
      {
        accessorKey: "mrp",
        header: "MRP",
        Cell: ({ renderedCellValue }) => `₹${renderedCellValue}`,
      },
    ],
    [],
  );

  const renderDetailPanel = ({ row }: any) => (
    <div
      style={{
        maxHeight: 300,
        overflowY: "auto",
        border: "1px solid #e5e5e5",
        borderRadius: 8,
      }}
    >
      <MaterialReactTable
        columns={variantColumns}
        data={row.original.variant ?? []}
        enablePagination={false}
        enableTopToolbar={false}
        enableBottomToolbar={false}
        enableColumnActions={false}
        enableSorting
        enableRowSelection={false}
        enableColumnFilters={false}
        enableDensityToggle={false}
        enableFullScreenToggle={false}
        muiTablePaperProps={{
          sx: {
            boxShadow: "none",
            border: "1px solid #e5e5e5",
          },
        }}
        initialState={{
          density: "compact",
        }}
      />
    </div>
  );

  return (
    <div className="flex flex-col w-full space-y-4 p-3 overflow-y-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
        <PermissionGuard module="Inventory" action="create">
          <ButtonGroup variant="contained">
            <CustomButton
              variant="contained"
              onClick={() => navigate("/products/add-product")}
              startIcon={<AddIcon />}
            >
              Add Product
            </CustomButton>
            <CustomButton onClick={handleBulkUpload}>
              <UploadFileIcon />
            </CustomButton>
          </ButtonGroup>
        </PermissionGuard>
      </div>

      {error && (
        <Alert severity="error" onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      <CustomTable
        columns={columns}
        renderDetailPanel={renderDetailPanel}
        data={products}
        isLoading={loading}
        enableRowSelection
        enableColumnPinning
        columnPinning={columnPinning}
        onColumnPinningChange={setColumnPinning}
        enableRowActions
        renderRowActions={({ row }) => (
          <div className="flex gap-1">
            <PermissionGuard module="Inventory" action="update">
              <IconButton
                onClick={() =>
                  navigate(`/products/edit-product/${row.original.id}`)
                }
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
            </PermissionGuard>
            <PermissionGuard module="Inventory" action="delete">
              <IconButton
                size="small"
                onClick={() => {
                  setSelectedProductId(row.original.id);
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
            </PermissionGuard>
          </div>
        )}
        renderTopToolbarCustomActions={({ table }) => {
          const selectedRows = table.getSelectedRowModel().rows;
          return (
            <div className="flex gap-2">
              <CustomButton
                variant="outlined"
                size="small"
                onClick={() => handleExportExcel(table)}
                startIcon={<FileDownload />}
              >
                Export Excel
              </CustomButton>
              {selectedRows.length > 0 && (
                <PermissionGuard module="Inventory" action="delete">
                  <CustomButton
                    variant="contained"
                    className="bg-red-500! hover:bg-red-600! text-white"
                    size="small"
                    onClick={() => handleBulkDelete({ table })}
                    startIcon={<DeleteIcon />}
                  >
                    Delete Selected ({selectedRows.length})
                  </CustomButton>
                </PermissionGuard>
              )}
            </div>
          );
        }}
      />

      <BulkProductDialog
        open={bulkDialogOpen}
        onClose={() => setBulkDialogOpen(false)}
        refetch={refetch}
      />

      <DeleteProductDialog
        open={openDeleteDialog}
        productId={selectedProductId}
        onClose={() => setOpenDeleteDialog(false)}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </div>
  );
};

export default ProductsPage;
