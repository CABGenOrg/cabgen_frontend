// components/General/SmartSelect.tsx
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox, type ComboboxOption } from "./ComboBox";

// Acima disso, o Select nativo do Radix começa a pesar
// (DOM grande, sem busca). Abaixo, mantém a UX simples e acessível.
const VIRTUALIZE_THRESHOLD = 200;

export function SmartSelect({
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
  if (options.length > VIRTUALIZE_THRESHOLD) {
    return (
      <Combobox
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
      />
    );
  }

  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="text-black focus-visible:ring-2 focus-visible:ring-cabgen-200 focus-visible:outline-none 2xl:text-xl sm:text-base">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
