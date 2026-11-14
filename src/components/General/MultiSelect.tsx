"use client";

import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import type { ComboboxOption } from "./ComboBox";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";

interface MultiSelectProps {
  values: string[];
  onChange: (values: string[]) => void;
  options: ComboboxOption[];
  placeholder: string;
  searchable?: boolean;
}

export function MultiSelect({
  values,
  onChange,
  options,
  placeholder,
  searchable,
}: MultiSelectProps) {
  const lang = useLanguage();
  const {
    dictionary: { General },
  } = getTranslateClient(lang);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const seen = new Set<string>();
    const unique = options.filter((o) => {
      if (seen.has(o.value)) return false;
      seen.add(o.value);
      return true;
    });
    if (!search) return unique;
    const q = search.toLowerCase();
    return unique.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, search]);

  const selectedOptions = options.filter((o) => values.includes(o.value));
  const selectedLabel =
    values.length === 0
      ? placeholder
      : values.length === 1
        ? selectedOptions[0]?.label ?? placeholder
        : General.selected.replace("{count}", String(values.length));

  const handleToggle = (val: string) => {
    onChange(
      values.includes(val)
        ? values.filter((v) => v !== val)
        : [...values, val],
    );
  };

  const handleSelectAll = () => {
    const missing = filtered
      .filter((o) => !values.includes(o.value))
      .map((o) => o.value);
    onChange([...values, ...missing]);
  };

  const allSelected =
    filtered.length > 0 && filtered.every((o) => values.includes(o.value));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal text-foreground px-3.5 text-base 2xl:text-lg overflow-hidden"
        >
          <span className="truncate min-w-0">{selectedLabel}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        {searchable && (
          <div className="p-2">
            <Input
              autoFocus
              placeholder={placeholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-border">
          <button
            type="button"
            onClick={handleSelectAll}
            disabled={allSelected}
            className="text-sm text-cabgen-600 dark:text-cabgen-300 hover:text-cabgen-200 disabled:opacity-50 disabled:cursor-default"
          >
            {General.selectAll}
          </button>
          <button
            type="button"
            onClick={() => onChange([])}
            disabled={values.length === 0}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-default"
          >
            <X size={14} />
            {General.clear}
          </button>
        </div>
        <div className="max-h-60 overflow-auto">
          {filtered.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground text-center">
              {General.noResults}
            </p>
          ) : (
            filtered.map((opt) => {
              const selected = values.includes(opt.value);
              return (
                <div
                  key={opt.value}
                  className="flex items-center px-3 py-1.5 text-sm cursor-pointer hover:bg-accent"
                  onClick={() => handleToggle(opt.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 shrink-0",
                      selected ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span
                    title={opt.label}
                    className="truncate flex-1 min-w-0"
                  >
                    {opt.label}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
