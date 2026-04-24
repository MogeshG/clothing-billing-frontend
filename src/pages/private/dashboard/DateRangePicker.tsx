import { Box, Typography } from "@mui/material";
import { CalendarMonth } from "@mui/icons-material";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { DateRange } from "../../../hooks/useAnalytics";

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

const DateRangePicker = ({ value, onChange }: DateRangePickerProps) => {
  const startValue = value.startDate ? dayjs(value.startDate) : null;
  const endValue = value.endDate ? dayjs(value.endDate) : null;

  return (
    <Box
      className="flex items-center gap-1.5 flex-wrap mb-2"
      sx={{
        bgcolor: "#fff",
        border: "1px solid",
        borderColor: "grey.200",
        borderRadius: 2,
        px: 2,
        py: 1.5,
      }}
    >
      <Box className="flex items-center gap-1">
        <CalendarMonth fontSize="small" />
        <Typography variant="caption" className="font-semibold">
          Custom Range
        </Typography>
      </Box>

      <Box className="flex items-center gap-1.5 flex-wrap">
        <Box sx={{ width: 200 }}>
          <DatePicker
            label="Start Date"
            value={startValue}
            format="DD/MM/YYYY"
            maxDate={endValue || undefined}
            onChange={(newValue) =>
              onChange({
                ...value,
                startDate: newValue ? newValue.format("YYYY-MM-DD") : "",
              })
            }
            slotProps={{ textField: { size: "small", fullWidth: true } }}
          />
        </Box>

        <Typography variant="caption" className="font-semibold">
          to
        </Typography>

        <Box sx={{ width: 200 }}>
          <DatePicker
            label="End Date"
            value={endValue}
            format="DD/MM/YYYY"
            minDate={startValue || undefined}
            onChange={(newValue) =>
              onChange({
                ...value,
                endDate: newValue ? newValue.format("YYYY-MM-DD") : "",
              })
            }
            slotProps={{ textField: { size: "small", fullWidth: true } }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default DateRangePicker;