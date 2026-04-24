import { Box, Skeleton, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import type { TopProduct } from "../../../hooks/useAnalytics";

interface TopProductsChartProps {
  data: TopProduct[];
  mode: "units" | "revenue";
  loading: boolean;
}

const TopProductsChart = ({ data, mode, loading }: TopProductsChartProps) => {
  if (loading) return <Skeleton variant="rectangular" height={260} sx={{ borderRadius: 2 }} />;

  if (data.length === 0)
    return (
      <Box className="flex items-center justify-center h-full gap-1">
        <Typography color="text.secondary">No product data for this period</Typography>
      </Box>
    );

  const labels = data.map((p) => (p.name.length > 12 ? p.name.slice(0, 12) + "…" : p.name));
  const values = mode === "units" ? data.map((p) => p.quantity) : data.map((p) => p.revenue);

  return (
    <BarChart
      xAxis={[{ scaleType: "band", data: labels, tickLabelStyle: { fontSize: 11 } }]}
      series={[
        {
          data: values,
          color: mode === "units" ? "#4facfe" : "#f093fb",
          label: mode === "units" ? "Units Sold" : "Revenue (₹)",
        },
      ]}
      height={260}
      margin={{ top: 20, bottom: 50, left: mode === "revenue" ? 70 : 40, right: 20 }}
    />
  );
};

export default TopProductsChart;
