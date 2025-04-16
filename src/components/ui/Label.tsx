import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, ReactNode } from "react";

interface LabelProps extends ComponentPropsWithoutRef<"label"> {
  children: ReactNode;
  variant?: "default" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Label({
  children,
  variant = "default",
  size = "md",
  className,
  ...props
}: LabelProps) {
  return (
    <label
      className={cn(
        "inline-block font-medium",
        {
          // Variants
          "text-gray-900": variant === "default",
          "text-gray-600": variant === "secondary",
          "text-gray-500": variant === "ghost",
          
          // Sizes
          "text-sm": size === "sm",
          "text-base": size === "md",
          "text-lg": size === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
} 