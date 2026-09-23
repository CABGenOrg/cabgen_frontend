"use client";

import { useCallback, useMemo, useState } from "react";
import { List, type RowComponentProps } from "react-window";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";

export type ComboboxOption = { value: string; label: string };

type RowProps = {
  filtered: ComboboxOption[];
  value: string;
  onSelect: (value: string) => void;
};

function Row({
  index,
  style,
  filtered,
  value,
  onSelect,
}: RowComponentProps<RowProps>) {
  const opt = filtered[index];
  if (!opt) return null;
  return (
    <div
      style={style}
      className="flex items-center px-3 text-sm cursor-pointer hover:bg-gray-100"
      onClick={() => onSelect(opt.value)}
    >
      <Check
        className={cn(
          "mr-2 h-4 w-4 shrink-0",
          value === opt.value ? "opacity-100" : "opacity-0",
        )}
      />
      <span title={opt.label} className="truncate flex-1 min-w-0">
        {opt.label}
      </span>
    </div>
  );
}

export function Combobox({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  options: ComboboxOption[];
  placeholder: string;
}) {
  const lang = useLanguage();
  const noResults = getTranslateClient(lang).dictionary.General.noResults;
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
  }, [search, options]);

  const rowKey = useCallback(
    (index: number, data: RowProps) => data.filtered[index]?.value ?? index,
    [],
  );

  const selectedLabel = options.find((o) => o.value === value)?.label;

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
    setSearch("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal text-black px-3.5 text-base 2xl:text-xl overflow-hidden"
        >
          <span className="truncate min-w-0">
            {selectedLabel ?? placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <div className="p-2">
          <Input
            autoFocus
            placeholder={placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {filtered.length === 0 ? (
          <p className="p-4 text-sm text-gray-400 text-center">{noResults}</p>
        ) : (
          <List
            style={{ height: Math.min(filtered.length * 32, 260) }}
            rowComponent={Row}
            rowCount={filtered.length}
            rowHeight={32}
            rowKey={rowKey}
            rowProps={{ filtered, value, onSelect: handleSelect }}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
