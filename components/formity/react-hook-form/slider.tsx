import { useFormContext, Controller } from "react-hook-form";
import { Slider } from "@/components/ui/slider";
import Field from "../user-interface/field";

interface SliderFieldProps {
  name: string;
  label: string;
  subLabel?: string;
  min?: number;
  max?: number;
  step?: number;
}

export default function SliderField({ name, label, subLabel, min = 0, max = 7, step = 1 }: SliderFieldProps) {
  const { control, formState } = useFormContext();
  const error = formState.errors[name] as { message: string } | undefined;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Field label="" error={error} id={name}>
          <span className="text-lg min-w-[24px] py-4">{label}</span>
          <br />
          {subLabel && <span className="text-lg min-w-[24px] py-2 ">{subLabel}</span>}
          <div className="flex items-center gap-4 w-full">
            <span className="text-lg font-semibold min-w-[24px]">{field.value}</span>
            <Slider
              min={min}
              max={max}
              step={step}
              value={[field.value]}
              onValueChange={([val]) => field.onChange(val)}
              className="flex-1"
            />
            <span className="text-lg font-semibold min-w-[24px]"> </span>
          </div>
        </Field>
      )}
    />
  );
}
