import { Box, Skeleton, Typography } from "@mui/material";
import { ReceiptLong } from "@mui/icons-material";
import { LineChart } from "@mui/x-charts";
import type { SalesReportItem } from "../../../hooks/useAnalytics";

interface SalesTrendChartProps {
  data: SalesReportItem[];
  loading: boolean;
}

const SalesTrendChart = ({ data, loading }: SalesTrendChartProps) => {
  if (loading) return <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />;

  if (data.length === 0)
    return (
      <Box className="flex flex-col items-center justify-center h-full gap-1">
        <ReceiptLong sx={{ fontSize: 56, color: "grey.300" }} />
        <Typography color="text.secondary">No sales data for this period</Typography>
      </Box>
    );

  const labels = data.map((s) => s.date);
  const amounts = data.map((s) => s.amount);

  return (
    <LineChart
      xAxis={[{ data: labels, scaleType: "point", tickLabelStyle: { fontSize: 11 } }]}
      series={[{ data: amounts, area: true, color: "#667eea", showMark: false, label: "Revenue (₹)" }]}
      height={300}
      margin={{ top: 20, bottom: 40, left: 65, right: 20 }}
    />
  );
};

export default SalesTrendChart;
