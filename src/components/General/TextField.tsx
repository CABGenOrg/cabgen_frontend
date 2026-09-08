"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { input_class, label_class } from "@/styles/tailwind_classes";
import { useLanguage } from "@/redux/LanguageContext";
import PasswordInput from "./PasswordInput";

const TextField: React.FC<{
  name: string;
  label: string;
  form: any;
  type?: string;
  required?: boolean;
}> = ({ name, label, form, type = "text", required }) => {
  const lang = useLanguage();
  return (
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
            {type === "password" ? (
              <PasswordInput field={field} />
            ) : (
              <input
                type={type}
                lang={type === "date" ? lang : undefined}
                className={input_class}
                {...field}
              />
            )}
          </FormControl>
          <FormMessage className="text-red-600" />
        </FormItem>
      )}
    />
  );
};

export default TextField;
