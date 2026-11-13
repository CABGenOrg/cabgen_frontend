"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  retryLabel?: string;
  onRetry?: () => void;
}

const ErrorState = ({
  title,
  description,
  retryLabel,
  onRetry,
}: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-100" />
      </div>
      {title && (
        <h3 className="text-lg font-semibold text-foreground mb-1">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-4">
          {description}
        </p>
      )}
      {onRetry && retryLabel && (
        <Button variant="outline" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
