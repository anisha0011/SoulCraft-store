import React from 'react';
import { cn } from '../../utils/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'destructive';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-[#E8A0B8] text-white hover:bg-[#C96F91]",
    secondary: "border-transparent bg-[#FFF5F8] text-[#3A2930] hover:bg-[#FCE7EF]",
    outline: "text-[#3A2930] border-[#F0DDE4]",
    success: "border-transparent bg-[#4F9D69] text-white",
    destructive: "border-transparent bg-[#D9536F] text-white",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
