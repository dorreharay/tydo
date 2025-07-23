import * as React from "react";
import { cn } from "@/lib/utils";

interface ResponsiveChartContainerProps {
  children: React.ReactNode;
  className?: string;
  minHeight?: string;
  maxHeight?: string;
}

export function ResponsiveChartContainer({
  children,
  className,
  minHeight = "250px",
  maxHeight = "400px",
}: ResponsiveChartContainerProps) {
  return (
    <div
      className={cn(
        "w-full",
        "h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]",
        className
      )}
      style={{
        minHeight,
        maxHeight,
      }}
    >
      {children}
    </div>
  );
}