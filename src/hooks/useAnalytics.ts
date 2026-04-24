import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API_BASE } from "../utils/auth";

export type Period = "today" | "week" | "month" | "year" | "all" | "custom";

export interface DashboardStats {
  revenue: number;
  revenueGrowth: number | null;
  invoiceCount: number;
  orderGrowth: number | null;
  totalCustomers: number;
  newCustomers: number;
  lowStockItems: number;
  totalInvoices: number;
  avgOrderValue: number;
}

export interface SalesReportItem {
  date: string;
  amount: number;
}

export interface TopProduct {
  name: string;
  quantity: number;
  revenue: number;
}

export interface LowStockItem {
  product_name: string;
  remaining_quantity: number;
}

export interface PaymentBreakdown {
  method: string;
  revenue: number;
  count: number;
}

export interface DateRange {
  startDate: string;  // ISO date string YYYY-MM-DD
  endDate: string;
}

export const useAnalytics = (period: Period = "month", customRange?: DateRange) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [salesReport, setSalesReport] = useState<SalesReportItem[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [lowStock, setLowStock] = useState<LowStockItem[]>([]);
  const [paymentBreakdown, setPaymentBreakdown] = useState<PaymentBreakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    // Don't fetch custom range if dates are incomplete
    if (period === "custom" && (!customRange?.startDate || !customRange?.endDate)) return;

    try {
      setLoading(true);
      const params: Record<string, string> = { period };
      if (period === "custom" && customRange) {
        params.startDate = customRange.startDate;
        params.endDate = customRange.endDate;
      }

      const [statsRes, salesRes, topRes, lowRes, payRes] = await Promise.all([
        axios.get(`${API_BASE}/v1/analytics/stats`, { params }),
        axios.get(`${API_BASE}/v1/analytics/sales-report`, { params }),
        axios.get(`${API_BASE}/v1/analytics/top-products`, { params }),
        axios.get(`${API_BASE}/v1/analytics/low-stock`),
        axios.get(`${API_BASE}/v1/analytics/payment-breakdown`, { params }),
      ]);

      setStats(statsRes.data);
      setSalesReport(salesRes.data);
      setTopProducts(topRes.data);
      setLowStock(lowRes.data);
      setPaymentBreakdown(payRes.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  }, [period, customRange?.startDate, customRange?.endDate]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { stats, salesReport, topProducts, lowStock, paymentBreakdown, loading, error, refetch: fetchAnalytics };
};
