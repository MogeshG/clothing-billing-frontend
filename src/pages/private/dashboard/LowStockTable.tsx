import {
  Box,
  Chip,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Inventory2 } from "@mui/icons-material";
import type { LowStockItem } from "../../../hooks/useAnalytics";

interface LowStockTableProps {
  data: LowStockItem[];
  loading: boolean;
}

const LowStockTable = ({ data, loading }: LowStockTableProps) => {
  if (loading) return <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />;

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: "grey.50" }}>
            {["Product Name", "Total Remaining Qty", "Status"].map((h) => (
              <TableCell key={h} sx={{ fontWeight: 700, fontSize: "0.75rem", py: 1.5 }}>
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map((item) => (
              <TableRow key={item.product_name} hover>
                <TableCell sx={{ fontWeight: 600 }}>{item.product_name}</TableCell>
                <TableCell>
                  <Typography
                    className="font-bold"
                    color={item.remaining_quantity === 0 ? "error.main" : "warning.main"}
                  >
                    {item.remaining_quantity}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={item.remaining_quantity === 0 ? "OUT OF STOCK" : "LOW STOCK"}
                    size="small"
                    color={item.remaining_quantity === 0 ? "error" : "warning"}
                    sx={{ fontWeight: 700, fontSize: "0.68rem" }}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} align="center" sx={{ py: 5 }}>
                <Box className="flex flex-col items-center justify-center h-full gap-1">
                  <Inventory2 sx={{ fontSize: 48, color: "grey.300" }} />
                  <Typography color="text.secondary">All stock levels are healthy</Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LowStockTable;
