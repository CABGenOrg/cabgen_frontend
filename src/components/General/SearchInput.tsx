"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { input_class } from "@/styles/tailwind_classes";

interface SearchInputProps {
  onSearch: (term: string) => void;
  placeholder?: string;
}

const SearchInput = ({
  onSearch,
  placeholder = "Search...",
}: SearchInputProps) => {
  const [value, setValue] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onSearch(e.target.value), 300);
  };

  return (
    <div className="relative mb-4">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`${input_class} pl-9`}
      />
    </div>
  );
};

export default SearchInput;