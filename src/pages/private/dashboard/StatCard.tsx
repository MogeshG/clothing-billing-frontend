import React from "react";
import { Card, CardContent, Typography, Box, Skeleton } from "@mui/material";
import { TrendingUp, TrendingDown } from "@mui/icons-material";

export interface StatCardProps {
  title: string;
  value: string | number;
  sub?: string;
  growth?: number | null;
  icon: React.ReactElement;
  gradient: string;
  loading?: boolean;
}

const StatCard = ({ title, value, sub, growth, icon, gradient, loading }: StatCardProps) => (
  <Card
    elevation={0}
    sx={{
      height: "100%",
      borderRadius: 3,
      background: gradient,
      color: "#fff",
      position: "relative",
      overflow: "hidden",
      "&::after": {
        content: '""',
        position: "absolute",
        top: -30,
        right: -30,
        width: 130,
        height: 130,
        background: "rgba(255,255,255,0.08)",
        borderRadius: "50%",
      },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box className="flex items-center justify-between">
        <Box className="flex-1">
          <Typography variant="caption" sx={{ opacity: 0.85, fontWeight: 600, letterSpacing: 1 }}>
            {title.toUpperCase()}
          </Typography>
          {loading ? (
            <Skeleton variant="text" width={120} height={44} sx={{ bgcolor: "rgba(255,255,255,0.25)" }} />
          ) : (
            <Typography variant="h5" className="mt-0.5 leading-1.2" noWrap>
              {value}
            </Typography>
          )}
          {sub && (
            <Typography variant="caption" sx={{ opacity: 0.75, mt: 0.5, display: "block" }}>
              {sub}
            </Typography>
          )}
          {growth !== undefined && growth !== null && (
            <Box className="flex items-center gap-0.5 mt-1">
              {growth >= 0 ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
              <Typography variant="body2" className="font-semibold">
                {Math.abs(growth).toFixed(1)}% vs prev. period
              </Typography>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            bgcolor: "rgba(255,255,255,0.2)",
            borderRadius: 2,
            p: 1.2,
            display: "flex",
            flexShrink: 0,
            ml: 1,
            zIndex: 1,
          }}
        >
          {React.cloneElement(icon)}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default StatCard;
