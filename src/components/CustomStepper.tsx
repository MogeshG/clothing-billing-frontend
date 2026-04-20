import React from "react";
import { RemoveCircle, AddCircle } from "@mui/icons-material";
import { IconButton } from "@mui/material";

type StepperProps = {
  value: number;
  min?: number;
  max?: number;
  inputClass?: string;
  onChange: (val: number) => void;
  onIncrease: () => void;
  onDecrease: () => void;
};

const Stepper: React.FC<StepperProps> = ({
  value,
  min = 0,
  max = 1000,
  inputClass = "",
  onChange,
  onIncrease,
  onDecrease,
}) => {
  const canDecrease = value > min;
  const canIncrease = value < max;

  return (
    <div className="flex items-center gap-1">
      <IconButton
        sx={{
          border: "1px solid",
          color: "primary.main",
          borderRadius: 10,
          padding: 0,
        }}
        onClick={onDecrease}
        disabled={!canDecrease}
      >
        <RemoveCircle
          sx={{
            fontSize: "2rem",
          }}
        />
      </IconButton>

      <input
        type="number"
        min={min}
        max={max}
        className={`w-12 text-center font-medium outline-none focus:border border-primary-300 text-sm rounded-sm ${inputClass}`}
        onChange={(e) => {
          const numVal = parseInt(e.target.value);
          if (!isNaN(numVal)) {
            onChange(Math.max(min || 0, Math.min(max || 1000, numVal)));
          }
        }}
        value={value}
        inputMode="numeric"
      />

      <IconButton
        sx={{
          border: "1px solid",
          color: "primary.main",
          borderRadius: 10,
          padding: 0,
        }}
        onClick={onIncrease}
        disabled={!canIncrease}
      >
        <AddCircle
          sx={{
            fontSize: "2rem",
          }}
        />
      </IconButton>
    </div>
  );
};

export default Stepper;
