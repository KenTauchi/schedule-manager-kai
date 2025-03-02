"use client";

import { cn } from "@/lib/utils";
import { useForm, useFormContext } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type FormInputProps = {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  description?: string;
  className?: string;
  required?: boolean;
  items: { value: string; label: string }[];
};

export default function FormInput({
  name,
  label,
  items,
  type,
  placeholder,
  description,
  className,
  required,
}: FormInputProps) {
  const { control, register } = useFormContext();
  return (
    <FormField
      control={control}
      {...register(name)}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className={cn("bg-background", className)}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {items.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
