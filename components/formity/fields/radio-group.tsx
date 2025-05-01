import { useId } from "react";
import { Radio, RadioGroup as HeadlessRadioGroup } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";

import { cn } from "@/components/utils";

import Field from "../user-interface/field";
import Input from "../user-interface/input";

interface RadioGroupProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  direction: "x" | "y";
  error: { message: string } | undefined;
}

export default function RadioGroup({
  label,
  value,
  onChange,
  options,
  direction,
  error,
}: RadioGroupProps) {
  const id = useId();
  return (
    <Field id={id} label={label} error={error}>
      <HeadlessRadioGroup
        value={value}
        onChange={onChange}
        className={cn(
          direction === "y"
            ? "flex flex-col gap-3 mt-2 w-full"
            : "flex flex-row gap-4 mt-2"
        )}
      >
        {options.map((option) => (
          <Radio
            key={option.value}
            value={option.value}
            className={cn(
              "flex items-center px-4 py-2 rounded-full border border-white bg-black text-white text-base font-normal transition-all duration-150 cursor-pointer min-w-[120px] justify-between",
              "hover:border-[#706cf7] focus:border-[#706cf7]",
              value === option.value ? "border-[#706cf7]" : "border-white/40",
              error && "border-red-500",
            )}
          >
            <span>{option.label}</span>
            {value === option.value && (
              <CheckIcon className="ml-2 h-6 w-6 text-white" />
            )}
          </Radio>
        ))}
      </HeadlessRadioGroup>
    </Field>
  );
}
