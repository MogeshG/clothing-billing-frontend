import { TextField, InputAdornment, type TextFieldProps } from "@mui/material";
import { type ReactNode } from "react";
import clsx from "clsx";

export type InputSize = "small" | "medium";

export type InputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "search"
  | "tel"
  | "url"
  | "date"
  | "time"
  | "datetime-local";

export interface CustomInputProps extends Omit<
  TextFieldProps,
  "size" | "type" | "helperText"
> {
  label?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: InputType;
  placeholder?: string;
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
  inputClassName?: string;
  fieldClassName?: string;
  labelClassName?: string;
  helperTextClassName?: string;
  startIconClassName?: string;
  endIconClassName?: string;
}

export default function CustomInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
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
  inputClassName,
  fieldClassName,
  labelClassName,
  helperTextClassName,
  startIconClassName,
  endIconClassName,
  ...rest
}: CustomInputProps) {
  const showError = hasError && errorText;

  return (
    <div
      className={clsx(
        "flex flex-col rounded-lg bg-transparent",
        fullWidth && "w-full",
        containerClassName,
        "bg-gray-50",
      )}
    >
      <TextField
        label={label}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        error={hasError}
        disabled={disabled}
        required={required}
        fullWidth={fullWidth}
        size={size}
        variant="outlined"
        InputProps={{
          className: clsx("transition-all rounded-lg", inputClassName),
          startAdornment: startIcon ? (
            <InputAdornment position="start">
              <span className={clsx("flex items-center", startIconClassName)}>
                {startIcon}
              </span>
            </InputAdornment>
          ) : undefined,
          endAdornment: endIcon ? (
            <InputAdornment position="end">
              <span className={clsx("flex items-center", endIconClassName)}>
                {endIcon}
              </span>
            </InputAdornment>
          ) : undefined,
        }}
        InputLabelProps={{
          className: clsx("text-sm font-medium", labelClassName),
        }}
        inputProps={{
          className: clsx("bg-transparent", fieldClassName),
        }}
        {...rest}
      />

      {/* Helper / Error */}
      {(fixedErrorSpace || showError) && (
        <span
          className={clsx(
            "text-sm transition-all min-h-5 rounded px-1",
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
    </div>
  );
}
