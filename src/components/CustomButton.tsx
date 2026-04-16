import { Button, CircularProgress } from "@mui/material";
import clsx from "clsx";
import { type ReactNode, type MouseEventHandler } from "react";

type ButtonVariant = "text" | "outlined" | "contained";
type ButtonSize = "small" | "medium" | "large";

interface CustomButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  hasPermission?: boolean;
  className?: string;
  children: ReactNode;
}

const CustomButton = ({
  variant = "contained",
  size = "medium",
  startIcon,
  endIcon,
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  hasPermission = true,
  className,
  children,
}: CustomButtonProps) => {
  const isDisabled = disabled || loading || !hasPermission;

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (isDisabled) return;
    onClick?.(e);
  };

  return (
    <Button
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={isDisabled}
      onClick={handleClick}
      startIcon={!loading ? startIcon : undefined}
      endIcon={!loading ? endIcon : undefined}
      className={clsx(
        "normal-case font-medium rounded-lg shadow-sm transition-all duration-200",
        className,
      )}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <CircularProgress size={18} color="inherit" />
          <span className="opacity-80">{children}</span>
        </span>
      ) : (
        children
      )}
    </Button>
  );
};

export default CustomButton;
