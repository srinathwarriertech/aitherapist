import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { cn } from "@/components/utils";

interface BackButtonProps {
  onBack: () => void;
}

export default function BackButton({ onBack }: BackButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "back-btn block rounded-full border border-white/30 bg-white/10 px-7 py-3 shadow-lg hover:bg-white/20",
        "focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black",
        "disabled:opacity-60",
        "transition-all duration-150",
      )}
      style={{ minWidth: 56, minHeight: 56 }}
      onClick={onBack}
    >
      <ChevronLeftIcon className="pointer-events-none h-7 w-7 text-black" />
    </button>
  );
}
