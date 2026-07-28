// components/General/Combobox.tsx
"use client";

import { useMemo, useState } from "react";
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
  return (
    <div
      style={style}
      className="flex items-center px-3 text-sm cursor-pointer hover:bg-gray-100"
      onClick={() => onSelect(opt.value)}
    >
      <Check
        className={cn(
          "mr-2 h-4 w-4",
          value === opt.value ? "opacity-100" : "opacity-0",
        )}
      />
      {opt.label}
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
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return options;
    const q = search.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [search, options]);

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
          className="w-full justify-between font-normal text-black sm:text-base"
        >
          {selectedLabel ?? placeholder}
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
          <p className="p-4 text-sm text-gray-400 text-center">
            Nenhum resultado
          </p>
        ) : (
          <div style={{ height: 260 }}>
            <List
              rowComponent={Row}
              rowCount={filtered.length}
              rowHeight={32}
              rowProps={{ filtered, value, onSelect: handleSelect }}
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
