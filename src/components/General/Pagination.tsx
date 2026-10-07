"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  disabled?: boolean;
}

const Pagination = ({ page, totalPages, onChange, disabled = false }: PaginationProps) => {
  const lang = useLanguage();
  const {
    dictionary: { General },
  } = getTranslateClient(lang);
  const dict = General.pagination;

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground whitespace-nowrap">
        {dict.page
          .replace("{page}", String(page))
          .replace("{total}", String(totalPages))}
      </span>
      <Button
        variant="outline"
        size="sm"
        aria-label={dict.previous}
        title={dict.previous}
        disabled={disabled || page <= 1}
        onClick={() => onChange(page - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        aria-label={dict.next}
        title={dict.next}
        disabled={disabled || page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination;
