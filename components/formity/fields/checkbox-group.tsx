import { useId } from "react";
import { CheckIcon } from "@heroicons/react/20/solid";

import { cn } from "@/components/utils";

import Field from "../user-interface/field";
import Input from "../user-interface/input";

interface CheckboxGroupProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: { value: string; label: string }[];
  direction: "x" | "y";
  error: { message: string } | undefined;
}

export default function CheckboxGroup({
  label,
  value,
  onChange,
  options,
  direction,
  error,
}: CheckboxGroupProps) {
  const id = useId();
  return (
    <Field id={id} label={label} error={error}>
      <div
        className={cn(
          direction === "y"
            ? "flex flex-col gap-3 mt-2 w-full"
            : "flex flex-row gap-4 mt-2"
        )}
      >
        {options.map((option) => (
          <Input
            key={option.value}
            as="button"
            type="button"
            value={option.value}
            onClick={() => {
              if (value.includes(option.value)) {
                onChange(value.filter((v) => v !== option.value).sort());
              } else {
                onChange([...value, option.value].sort());
              }
            }}
            className={cn(
              "flex items-center px-8 py-4 rounded-full border border-black bg-white text-black text-lg font-normal transition-all duration-150 cursor-pointer min-w-[180px] justify-between",
              "hover:border-[#706cf7] focus:border-[#706cf7]",
              value.includes(option.value) ? "border-[#706cf7]" : "border-black/40",
              error && "border-red-500",
            )}
          >
            <span>{option.label}</span>
            {value.includes(option.value) && (
            <CheckIcon className={cn("ml-2 h-6 w-6 text-black")}/>
            )}
          </Input>
        ))}
      </div>
    </Field>
  );
}
