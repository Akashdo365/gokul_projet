import { LucideIcon } from "lucide-react";
import { useSpeech } from "@/hooks/use-speech";
import { cn } from "@/lib/utils";

interface BigButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label: string;
  variant?: "primary" | "secondary" | "danger";
  description?: string;
}

export function BigButton({ 
  icon: Icon, 
  label, 
  variant = "secondary", 
  description,
  className,
  onClick,
  ...props 
}: BigButtonProps) {
  const { speak } = useSpeech();

  const handleFocus = () => {
    speak(description || label);
  };

  const variants = {
    primary: "bg-primary text-primary-foreground hover:brightness-110 active:scale-[0.98]",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.98] border border-border",
    danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-[0.98] animate-pulse-emergency",
  };

  return (
    <button
      className={cn(
        "w-full p-6 rounded-2xl flex flex-col items-center justify-center gap-4 transition-all duration-200 shadow-lg min-h-[160px]",
        variants[variant],
        className
      )}
      onClick={onClick}
      onFocus={handleFocus}
      onMouseEnter={handleFocus}
      aria-label={label}
      {...props}
    >
      <Icon className="w-12 h-12" strokeWidth={2.5} />
      <span className="text-xl font-bold text-center tracking-tight leading-tight">
        {label}
      </span>
    </button>
  );
}
