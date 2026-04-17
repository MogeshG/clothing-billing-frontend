import { useCallback, useMemo } from "react";
import type { MRT_ColumnDef } from "material-react-table";
import { useDispatch } from "react-redux";
import {
  Alert,
  Chip,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Download } from "@mui/icons-material";
import { useStockMovements } from "../../../hooks/useStockMovements";
import type { StockMovement } from "../../../types/stockMovement";
import { CustomTable } from "../../../components/CustomTable";
import CustomButton from "../../../components/CustomButton";
import type { AppDispatch } from "../../../store";
import { clearError } from "../../../slices/stockMovementsSlice";
import dayjs from "dayjs";

interface DetailPanelProps {
  row: { original: StockMovement };
}

const getTypeColor = (type: StockMovement["type"]) => {
  switch (type) {
    case "IN":
      return "success";
    case "OUT":
      return "error";
    case "ADJUSTMENT":
      return "warning";
    default:
      return "default";
  }
};

const getTypeLabel = (type: StockMovement["type"]) => {
  switch (type) {
    case "IN":
      return "IN";
    case "OUT":
      return "OUT";
    case "ADJUSTMENT":
      return "ADJ";
    default:
      return type;
  }
};

const StockMovementsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { stockMovements, loading, error } = useStockMovements();

  const filteredData = useMemo(() => {
    return stockMovements;
  }, [stockMovements]);

  const columns = useMemo<MRT_ColumnDef<StockMovement>[]>(
    () => [
      {
        accessorKey: "createdAt",
        header: "Date",
        Cell: ({ renderedCellValue }) =>
          renderedCellValue
            ? dayjs(renderedCellValue as string).format("DD/MM/YYYY HH:mm")
            : "N/A",
        size: 140,
      },
      {
        accessorKey: "productName",
        header: "Product Name",
        size: 200,
      },
      {
        accessorKey: "sku",
        header: "SKU",
        size: 120,
      },
      {
        accessorKey: "type",
        header: "Type",
        Cell: ({ row }) => (
          <Chip
            label={getTypeLabel(row.original.type)}
            color={getTypeColor(row.original.type)}
            size="small"
          />
        ),
        size: 100,
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
        Cell: ({ row }) => (
          <strong>
            {row.original.type === "ADJUSTMENT"
              ? `${row.original.quantity > 0 ? "+" : ""}${row.original.quantity}`
              : row.original.quantity}
          </strong>
        ),
        size: 100,
      },
      {
        accessorKey: "invoiceNo",
        header: "Reference",
        Cell: ({ row }) => {
          const ref =
            row.original.invoiceNo ||
            row.original.purchaseNo ||
            row.original.batchNo ||
            "N/A";
          return <span>{ref}</span>;
        },
        size: 150,
      },
    ],
    [],
  );

  const DetailPanel = ({ row }: DetailPanelProps) => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Batch Details
      </Typography>
      {row.original.items.length > 0 ? (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Batch No</TableCell>
                <TableCell align="right">Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {row.original.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.batchNo}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography color="textSecondary">
          No batch breakdown available
        </Typography>
      )}
    </Box>
  );

  const exportToCSV = useCallback(() => {
    const headers = ["Date", "Product", "SKU", "Type", "Quantity", "Reference"];
    const csvRows = filteredData.map((m) => [
      dayjs(m.createdAt).format("DD/MM/YYYY HH:mm"),
      m.productName,
      m.sku || "",
      m.type,
      m.quantity,
      m.invoiceNo || m.purchaseNo || m.batchNo || "N/A",
    ]);
    const csvContent = [
      headers,
      ...csvRows.map((row) => row.join(",")),
      "",
    ].join("\\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stock-movements-${dayjs().format("YYYY-MM-DD")}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, [filteredData]);

  return (
    <div className="flex flex-col w-full space-y-4 p-3 overflow-y-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Stock Movements</h1>
        <CustomButton
          variant="outlined"
          startIcon={<Download />}
          onClick={exportToCSV}
        >
          Export CSV
        </CustomButton>
      </div>

      {error && (
        <Alert severity="error" onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      <CustomTable
        columns={columns}
        data={filteredData}
        isLoading={loading}
        enableExpanding
        enableRowActions={false}
        enableColumnFilters={false}
        enableGlobalFilter={false}
        enablePagination
        enableRowSelection={false}
        enableColumnPinning
        manualFiltering
        renderDetailPanel={DetailPanel}
      />
    </div>
  );
};

export default StockMovementsPage;
