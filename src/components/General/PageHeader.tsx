"use client";

import { Plus } from "lucide-react";
import { section_btn } from "@/styles/tailwind_classes";

const PageHeader: React.FC<{
  icon: React.ReactNode;
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}> = ({ icon, title, actionLabel, onAction }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
    <h1 className="text-2xl font-semibold flex items-center gap-2">
      <span className="text-cabgen-400">{icon}</span>
      <span className="bg-gradient-to-r from-cabgen-700 to-cabgen-400 bg-clip-text text-transparent">
        {title}
      </span>
    </h1>
    {actionLabel && onAction && (
      <button
        className={`${section_btn} flex items-center justify-center gap-1.5 shrink-0 w-full sm:w-auto`}
        onClick={onAction}
      >
        <Plus size={20} /> {actionLabel}
      </button>
    )}
  </div>
);

export default PageHeader;
