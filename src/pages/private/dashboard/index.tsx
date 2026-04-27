import { useState } from "react";
import {
  Grid,
  Box,
  Typography,
  Alert,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  Refresh,
  AccountBalanceWallet,
  ShoppingCart,
  People,
  Warning,
} from "@mui/icons-material";
import dayjs from "dayjs";

import {
  useAnalytics,
  type Period,
  type DateRange,
} from "../../../hooks/useAnalytics";
import formatRupee from "../../../utils/formatRupee";

import StatCard from "./StatCard";
import SectionCard from "./SectionCard";
import PeriodSelector from "./PeriodSelector";
import DateRangePicker from "./DateRangePicker";
import SalesTrendChart from "./SalesTrendChart";
import PaymentMethodChart from "./PaymentMethodChart";
import TopProductsChart from "./TopProductsChart";
import LowStockTable from "./LowStockTable";
import { usePreferences } from "../../../hooks/usePreferences";

const DashboardPage = () => {
  const [period, setPeriod] = useState<Period>("month");
  const { preferences } = usePreferences();
  const [customRange, setCustomRange] = useState<DateRange>({
    startDate: dayjs().subtract(30, "day").format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
  });

  const {
    stats,
    salesReport,
    topProducts,
    lowStock,
    paymentBreakdown,
    loading,
    error,
    refetch,
  } = useAnalytics(period, period === "custom" ? customRange : undefined);

  const statCards = [
    {
      title: "Revenue",
      value: formatRupee(stats?.revenue ?? 0),
      sub: `Avg Order: ${formatRupee(stats?.avgOrderValue ?? 0)}`,
      growth: stats?.revenueGrowth,
      icon: <AccountBalanceWallet />,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      title: "Orders",
      value: stats?.invoiceCount ?? "—",
      sub: `Total Invoices: ${stats?.totalInvoices ?? 0}`,
      growth: stats?.orderGrowth,
      icon: <ShoppingCart />,
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      title: "Customers",
      value: stats?.totalCustomers ?? "—",
      sub: `New this period: ${stats?.newCustomers ?? 0}`,
      icon: <People />,
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      title: "Low Stock Alerts",
      value: lowStock.length ?? "—",
      sub: `Items ≤ ${preferences.lowStockLimit} units`,
      icon: <Warning />,
      gradient: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
    },
  ];

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto">
      <Box
        sx={{
          p: { xs: 2, md: 3 },
          bgcolor: "grey.50",
          minHeight: "fit-content",
        }}
      >
        <Box className="flex items-start sm:items-center xs:flex-col sm:flex-row  justify-between gap-3 mb-3">
          <Box>
            <Typography variant="h4" className="font-bold leading-1.2">
              Dashboard
            </Typography>
            <Typography
              color="text.secondary"
              variant="body2"
              className="mt-0.5"
            >
              Real-time business insights
            </Typography>
          </Box>
          <Box className="flex items-center gap-2 flex-wrap">
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", fontWeight: 600, mr: 0.5 }}
            >
              View by:
            </Typography>
            <PeriodSelector value={period} onChange={setPeriod} />
            <Tooltip title="Refresh">
              <IconButton
                onClick={refetch}
                size="small"
                sx={{
                  bgcolor: "#fff",
                  border: "1px solid",
                  borderColor: "grey.200",
                }}
              >
                <Refresh fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* ── Custom date range row ── */}
        {period === "custom" && (
          <Box className="mb-2">
            <DateRangePicker value={customRange} onChange={setCustomRange} />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid className="w-full gap-4 mb-4" spacing={2} container>
          {statCards.map((card, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard {...card} loading={loading} />
            </Grid>
          ))}
        </Grid>

        {/* ── Row 1: Trend + Payment ── */}
        <Grid container spacing={1} className="mb-2 items-stretch">
          <Grid size={{ xs: 12, lg: 6 }}>
            <SectionCard title="📈 Sales Trend">
              <SalesTrendChart data={salesReport} loading={loading} />
            </SectionCard>
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <SectionCard title="💳 Payment Methods">
              <PaymentMethodChart data={paymentBreakdown} loading={loading} />
            </SectionCard>
          </Grid>
        </Grid>

        {/* ── Row 2: Top Products ── */}
        <Grid container spacing={1} className="mb-2 items-stretch">
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionCard title="🏆 Top Products — Units Sold">
              <TopProductsChart
                data={topProducts}
                mode="units"
                loading={loading}
              />
            </SectionCard>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionCard title="💰 Top Products — Revenue">
              <TopProductsChart
                data={topProducts}
                mode="revenue"
                loading={loading}
              />
            </SectionCard>
          </Grid>
        </Grid>

        {/* ── Row 3: Low Stock ── */}
        <Box>
          <SectionCard title="⚠️ Critical Stock Alerts">
            <LowStockTable data={lowStock} loading={loading} />
          </SectionCard>
        </Box>
      </Box>
    </div>
  );
};

export default DashboardPage;
