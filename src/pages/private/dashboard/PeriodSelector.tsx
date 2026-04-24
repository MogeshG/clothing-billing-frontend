import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import type { Period } from "../../../hooks/useAnalytics";

const PERIODS: { value: Period; label: string }[] = [
  { value: "today",  label: "Today" },
  { value: "week",   label: "Week" },
  { value: "month",  label: "Month" },
  { value: "year",   label: "Year" },
  { value: "all",    label: "All Time" },
  { value: "custom", label: "Custom" },
];

interface PeriodSelectorProps {
  value: Period;
  onChange: (p: Period) => void;
}

const PeriodSelector = ({ value, onChange }: PeriodSelectorProps) => (
  <ToggleButtonGroup
    value={value}
    exclusive
    onChange={(_, val) => val && onChange(val)}
    size="small"
    sx={{
      bgcolor: "#fff",
      borderRadius: 2,
      flexWrap: "wrap",
      "& .MuiToggleButton-root": {
        border: "1px solid",
        borderColor: "grey.200",
        px: 1.5,
        py: 0.5,
        fontSize: "0.75rem",
        fontWeight: 600,
        textTransform: "none",
        "&.Mui-selected": {
          bgcolor: "primary.main",
          color: "#fff",
          "&:hover": { bgcolor: "primary.dark" },
        },
      },
    }}
  >
    {PERIODS.map((p) => (
      <ToggleButton key={p.value} value={p.value}>
        {p.label}
      </ToggleButton>
    ))}
  </ToggleButtonGroup>
);

export default PeriodSelector;
