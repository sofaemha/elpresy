import React from "react";
import { cn } from "@/lib/utils";

interface NumericStepperProps {
  id: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

export function NumericStepper({
  id,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  disabled = false,
  className,
}: NumericStepperProps) {
  const dec = String(step).includes(".") ? String(step).split(".")[1].length : 0;
  const btnCls =
    "w-9 shrink-0 flex items-center justify-center text-lg font-light text-text-faint transition-all duration-150 hover:text-gold hover:bg-gold/8 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:text-text-faint disabled:hover:bg-transparent";

  return (
    <div
      className={cn(
        "h-9 w-full bg-zinc-900/80 rounded-lg border border-border/50 flex items-stretch overflow-hidden focus-within:border-gold/40 transition-colors",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <button
        type="button"
        onClick={() => onChange(+(value - step).toFixed(dec))}
        disabled={disabled || value <= min}
        className={cn(btnCls, "border-r border-border/40")}
      >
        −
      </button>
      <div className="flex-1 flex items-center justify-center gap-1.5 px-1">
        <input
          id={id}
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            if (!isNaN(v)) onChange(Math.min(max, Math.max(min, +v.toFixed(dec))));
          }}
          className="bg-transparent text-text-primary font-mono text-sm text-center w-full outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none disabled:cursor-not-allowed"
        />
        <span className="text-[10px] text-text-faint font-mono shrink-0">{unit}</span>
      </div>
      <button
        type="button"
        onClick={() => onChange(+(value + step).toFixed(dec))}
        disabled={disabled || value >= max}
        className={cn(btnCls, "border-l border-border/40")}
      >
        +
      </button>
    </div>
  );
}
