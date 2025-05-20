import { cn } from "@/components/utils";

interface FieldProps {
  children: React.ReactNode;
  id: string;
  label: string;
  labelClassName?: string;
  error: { message: string } | undefined;
}

export default function Field({
  children,
  id,
  label,
  labelClassName,
  error,
}: FieldProps) {
  return (
    <div className="space-y-1">
      <div className="relative">
        {children}
        <label
          htmlFor={id}
          className={cn(
            "absolute -top-3 left-7 block select-none text-base text-white font-normal transition-all z-10 bg-black px-1",
            { "text-red-500": error },
            labelClassName,
          )}
        >
          <span className="relative z-10">{label}</span>
        </label>
      </div>
      {error && <p className="ml-7 text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
