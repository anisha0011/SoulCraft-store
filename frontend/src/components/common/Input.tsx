import React from 'react';
import { cn } from '../../utils/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#3A2930] mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "flex h-11 w-full rounded-md border border-[#F0DDE4] bg-white px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#806B73] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A0B8] disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-[#D9536F] focus-visible:ring-[#D9536F]",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-[#D9536F]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
