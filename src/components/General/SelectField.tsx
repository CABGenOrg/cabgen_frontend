"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SmartSelect } from "./SmartSelect";
import { label_class } from "@/styles/tailwind_classes";

const SelectField: React.FC<{
  name: string;
  label: string;
  form: any;
  options: { value: string; label: string }[];
  placeholder: string;
  required?: boolean;
}> = ({ name, label, form, options, placeholder, required }) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel className={label_class}>
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </FormLabel>
        <FormControl>
          <SmartSelect
            value={field.value}
            onChange={field.onChange}
            options={options}
            placeholder={placeholder}
          />
        </FormControl>
        <FormMessage className="text-red-600" />
      </FormItem>
    )}
  />
);

export default SelectField;
