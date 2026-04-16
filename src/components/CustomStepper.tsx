import React from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import CustomButton from "./CustomButton";

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
      <CustomButton
        variant="outline"
        size="sm"
        className="h-7! w-7! rounded-sm! border-primary-500 bg-primary-300 hover:shadow-md"
        onClick={onDecrease}
        disabled={!canDecrease}
      >
        <FiMinus />
      </CustomButton>

      <input
        className={`w-12 text-center font-medium outline-none focus:border border-primary-300 text-sm rounded-sm ${inputClass}`}
        onChange={(e) => onChange(parseInt(e.target.value))}
        value={value}
      />

      <CustomButton
        variant="outline"
        size="sm"
        className="h-7! w-7! rounded-sm! border-primary-500 bg-primary-300 hover:shadow-md"
        onClick={onIncrease}
        disabled={!canIncrease}
      >
        <FiPlus />
      </CustomButton>
    </div>
  );
};

export default Stepper;
