"use client";

import React from "react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

const EmptyState = ({
  title,
  description,
  action,
  icon,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        {icon ?? <Inbox className="w-8 h-8 text-muted-foreground" />}
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
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
