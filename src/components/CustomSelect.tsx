/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  InputAdornment,
  type SelectProps,
} from "@mui/material";
import { type ReactNode } from "react";
import clsx from "clsx";

export type InputSize = "small" | "medium";

export interface CustomSelectProps extends Omit<
  SelectProps,
  "size" | "children" | "error" | "multiple" | "onChange"
> {
  label?: string;
  labelInside?: boolean; // floating label inside the select
  value?: string | number | (string | number)[];
  onChange: (value: any) => void;
  options?: { label: string; value: string | number }[];
  multiple?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  hasError?: boolean;
  errorText?: string;
  fixedErrorSpace?: boolean;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  size?: InputSize;
  containerClassName?: string;
  selectClassName?: string;
  labelClassName?: string;
  helperTextClassName?: string;
  startIconClassName?: string;
  endIconClassName?: string;
}

export default function CustomSelect({
  label,
  labelInside = true,
  value,
  onChange,
  options = [],
  multiple = false,
  startIcon,
  endIcon,
  hasError = false,
  errorText = "",
  fixedErrorSpace = false,
  disabled = false,
  required = false,
  fullWidth = true,
  size = "medium",
  containerClassName,
  selectClassName,
  labelClassName,
  helperTextClassName,
  startIconClassName,
  endIconClassName,
  ...rest
}: CustomSelectProps) {
  const showError = hasError && errorText;

  return (
    <div
      className={clsx(
        "flex flex-col",
        fullWidth && "w-full",
        containerClassName,
      )}
    >
      {label && !labelInside && (
        <span className={clsx("text-sm font-medium mb-1", labelClassName)}>
          {label} {required && "*"}
        </span>
      )}

      <FormControl fullWidth disabled={disabled} variant="outlined" size={size}>
        {labelInside && label && (
          <InputLabel id="custom-select-label">{label}</InputLabel>
        )}

        <Select
          multiple={multiple}
          value={value}
          onChange={(val) => onChange(val)}
          labelId={!labelInside ? "custom-select-label" : undefined}
          // label={label ? label : undefined}
          displayEmpty
          className={clsx("transition-all", selectClassName)}
          {...rest}
          startAdornment={
            startIcon ? (
              <InputAdornment position="start">
                <span className={clsx("flex items-center", startIconClassName)}>
                  {startIcon}
                </span>
              </InputAdornment>
            ) : undefined
          }
          endAdornment={
            endIcon ? (
              <InputAdornment position="end">
                <span className={clsx("flex items-center", endIconClassName)}>
                  {endIcon}
                </span>
              </InputAdornment>
            ) : undefined
          }
          error={hasError}
        >
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>

        {(fixedErrorSpace || showError) && (
          <span
            className={clsx(
              "ml-2 text-sm transition-all min-h-5 rounded px-1",
              showError
                ? "opacity-100 bg-red text-red-700"
                : fixedErrorSpace
                  ? "opacity-0"
                  : "",
              helperTextClassName,
            )}
          >
            {errorText || " "}
          </span>
        )}
      </FormControl>
    </div>
  );
}
