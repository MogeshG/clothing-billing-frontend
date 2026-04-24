import { Box, Skeleton, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import type { PaymentBreakdown } from "../../../hooks/useAnalytics";

interface PaymentMethodChartProps {
  data: PaymentBreakdown[];
  loading: boolean;
}

const COLORS = ["#667eea", "#f093fb", "#4facfe", "#f7971e", "#43e97b"];

const PaymentMethodChart = ({ data, loading }: PaymentMethodChartProps) => {
  if (loading) return <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 2 }} />;

  if (data.length === 0)
    return (
      <Box className="flex items-center justify-center h-full gap-1">
        <Typography color="text.secondary">No payment data for this period</Typography>
      </Box>
    );

  return (
    <PieChart
      series={[
        {
          data: data.map((p, i) => ({
            id: i,
            value: p.revenue,
            label: `${p.method} (${p.count})`,
            color: COLORS[i % COLORS.length],
          })),
          innerRadius: 50,
          outerRadius: 100,
          paddingAngle: 3,
          cornerRadius: 4,
        },
      ]}
      height={280}
      margin={{ top: 10, bottom: 10, left: 10, right: 160 }}
    />
  );
};

export default PaymentMethodChart;
