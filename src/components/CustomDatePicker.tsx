import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { Dayjs } from "dayjs";
import clsx from "clsx";
import { type ReactNode } from "react";

export interface CustomDatePickerProps {
  label?: string;
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;

  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;

  hasError?: boolean;
  errorText?: string;

  containerClassName?: string;
  inputClassName?: string;
  labelClassName?: string;

  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export default function CustomDatePicker({
  label,
  value,
  onChange,
  disabled = false,
  required = false,
  fullWidth = true,
  hasError = false,
  errorText = "",
  containerClassName,
  inputClassName,
  labelClassName,
}: CustomDatePickerProps) {
  const showError = hasError && errorText;

  return (
    <div
      className={clsx(
        "flex flex-col bg-gray-50 rounded-lg",
        fullWidth && "w-full",
        containerClassName,
      )}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label={label}
          value={value}
          onChange={onChange}
          disabled={disabled}
          slotProps={{
            textField: {
              fullWidth,
              required,
              error: hasError,
              className: clsx(inputClassName),
            },
          }}
          InputLabelProps={{
            shrink: true,
            className: clsx("text-sm font-medium", labelClassName),
          }}
        />
      </LocalizationProvider>

      {(showError || errorText) && (
        <span
          className={clsx(
            "text-sm min-h-5 px-1",
            showError ? "text-red-600" : "opacity-0",
          )}
        >
          {errorText || " "}
        </span>
      )}
    </div>
  );
}
