import { Link, useLocation } from "wouter";
import { ArrowLeft, User, Menu } from "lucide-react";
import { useSpeech } from "@/hooks/use-speech";

interface HeaderProps {
  title: string;
  showBack?: boolean;
}

export function Header({ title, showBack = true }: HeaderProps) {
  const { speak } = useSpeech();
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border/40 p-4">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center gap-3">
          {showBack && location !== "/" ? (
            <Link 
              href="/"
              className="p-3 -ml-2 rounded-full hover:bg-secondary active:bg-secondary/80 transition-colors focus:ring-4 focus:ring-primary"
              onClick={() => speak("Go back")}
              aria-label="Go back"
            >
              <ArrowLeft className="w-8 h-8 text-primary" />
            </Link>
          ) : (
            <div className="p-3 -ml-2">
              <Menu className="w-8 h-8 text-primary/50" />
            </div>
          )}
          <h1 
            className="text-2xl font-bold text-foreground"
            onClick={() => speak(title)}
            role="heading"
            aria-level={1}
          >
            {title}
          </h1>
        </div>

        <Link 
          href="/profile"
          className="p-3 rounded-full bg-secondary hover:bg-secondary/80 transition-colors focus:ring-4 focus:ring-primary"
          onClick={() => speak("Open Profile")}
          aria-label="Profile"
        >
          <User className="w-6 h-6 text-foreground" />
        </Link>
      </div>
    </header>
  );
}
