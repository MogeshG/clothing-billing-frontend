import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type {
  MRT_ColumnDef,
  MRT_ColumnFiltersState,
} from "material-react-table";
import { useDispatch } from "react-redux";
import { Alert, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { clearError } from "../../../slices/purchasesSlice";
import { usePurchases } from "../../../hooks/usePurchases";
import type { Purchase } from "../../../types/purchase";
import { CustomTable } from "../../../components/CustomTable";
import type { AppDispatch } from "../../../store";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { RemoveRedEye } from "@mui/icons-material";
import CustomButton from "../../../components/CustomButton";

const Purchases = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { purchases, loading, error } = usePurchases();
  const vendorFilter = searchParams.get("vendorName") || "";
  const filteredPurchases = useMemo(() => {
    if (!vendorFilter) return purchases;
    return purchases.filter(
      (p) =>
        p.vendorName?.toLowerCase().includes(vendorFilter.toLowerCase()) ||
        p.vendorPhone?.includes(vendorFilter),
    );
  }, [purchases, vendorFilter]);
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    [],
  );
  const [columnPinning, setColumnPinning] = useState({
    left: ["mrt-row-select", "purchaseNo", "status"],
    right: ["mrt-row-actions"],
  });

  const columns = useMemo<MRT_ColumnDef<Purchase>[]>(
    () => [
      {
        accessorKey: "purchaseNo",
        header: "Purchase No",
      },
      {
        accessorKey: "vendorName",
        header: "Vendor",
      },
      {
        accessorKey: "vendorPhone",
        header: "Phone",
        size: 140,
      },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ row }) => (
          <span
            className={
              row.original.status === "COMPLETED"
                ? "text-green-600 font-medium"
                : row.original.status === "DRAFT"
                  ? "text-blue-600 font-medium"
                  : "text-red-600 font-medium"
            }
          >
            {row.original.status}
          </span>
        ),
      },
      {
        accessorKey: "totalAmount",
        header: "Total Amount",
        Cell: ({ renderedCellValue }) =>
          `₹${Number(renderedCellValue).toLocaleString()}`,
      },
      {
        accessorKey: "purchaseDate",
        header: "Date",
        Cell: ({ renderedCellValue }) =>
          new Date(renderedCellValue as string).toLocaleDateString("en-IN"),
      },
    ],
    [],
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const vendor = params.get("vendorName");

    setColumnFilters([
      {
        id: "vendorName",
        value: vendor,
      },
    ]);
  }, []);

  useEffect(() => {
    const vendorFilter = columnFilters.find((f) => f.id === "vendorName");

    const next = new URLSearchParams(searchParams);

    if (vendorFilter?.value) {
      next.set("vendorName", String(vendorFilter.value));
    } else {
      next.delete("vendorName");
    }

    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnFilters]);

  return (
    <div className="flex flex-col w-full space-y-4 p-3 overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Purchases</h1>
        <CustomButton
          startIcon={<AddIcon />}
          onClick={() => navigate("/purchases/create-purchase")}
        >
          Create Purchase
        </CustomButton>
      </div>

      {error && (
        <Alert severity="error" onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      <CustomTable
        columns={columns}
        data={filteredPurchases}
        isLoading={loading}
        enableColumnPinning
        manualFiltering
        columnPinning={columnPinning}
        columnFilters={columnFilters}
        onColumnFiltersChange={setColumnFilters}
        onColumnPinningChange={setColumnPinning}
        enableRowSelection={false}
        enableRowActions
        renderRowActions={({ row }) => (
          <div className="flex gap-1">
            <IconButton
              onClick={() => {
                navigate(`/purchases/view-purchase/${row.original.id}`);
              }}
              size="small"
              sx={{
                border: "1px solid",
                borderColor: "secondary.main",
                color: "secondary.main",
                borderRadius: 1,
                width: 36,
                height: 36,
              }}
            >
              <RemoveRedEye fontSize="small" />
            </IconButton>
            {row.original.status === "DRAFT" && (
              <IconButton
                size="small"
                onClick={() => {
                  navigate(`/purchases/update-purchase/${row.original.id}`);
                }}
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
              </IconButton>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default Purchases;
