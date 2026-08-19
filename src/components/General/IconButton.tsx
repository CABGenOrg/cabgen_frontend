"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger" | "success" | "info";
  icon: React.ReactNode;
  label: string;
}

const IconButton = ({
  variant = "ghost",
  icon,
  label,
  className,
  ...props
}: IconButtonProps) => {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "h-10 w-10 inline-flex items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2",
        variant === "primary" &&
          "bg-cabgen-400 text-white hover:bg-cabgen-300 focus-visible:ring-cabgen-200",
        variant === "ghost" &&
          "text-gray-500 hover:text-cabgen-200 hover:bg-gray-100 focus-visible:ring-cabgen-200",
        variant === "danger" &&
          "text-gray-500 hover:text-red-600 hover:bg-red-50 focus-visible:ring-red-400",
        variant === "success" &&
          "text-green-600 hover:bg-green-50 focus-visible:ring-green-400",
        variant === "info" &&
          "text-blue-600 hover:bg-blue-50 focus-visible:ring-blue-400",
        className,
      )}
      {...props}
    >
      {icon}
    </button>
  );
};

export default IconButton;
