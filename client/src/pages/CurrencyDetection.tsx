import { useState } from "react";
import { Header } from "@/components/Header";
import { Camera } from "@/components/Camera";
import { useAiDetection } from "@/hooks/use-ai";
import { useSpeech } from "@/hooks/use-speech";
import { RotateCcw } from "lucide-react";

export default function CurrencyDetection() {
  const [result, setResult] = useState<string | null>(null);
  const { detectCurrency } = useAiDetection();
  const { speak } = useSpeech();

  const handleCapture = (image: string) => {
    detectCurrency.mutate(image, {
      onSuccess: (data) => {
        if (data.value === 0) {
          const msg = "Not recognized as currency.";
          setResult(msg);
          speak(msg);
        } else {
          const msg = `${data.value} ${data.currency}`;
          setResult(msg);
          speak(`This is ${msg}`);
        }
      },
      onError: () => {
        const msg = "Could not identify currency.";
        setResult(msg);
        speak(msg);
      }
    });
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      <Header title="Currency" />
      
      <main className="flex-1 p-4 flex flex-col gap-4 overflow-hidden">
        {result ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-8 bg-secondary rounded-3xl p-8 text-center animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-6xl font-black text-primary">
              {result}
            </h2>
            <button
              onClick={() => {
                setResult(null);
                speak("Ready.");
              }}
              className="flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold text-xl hover:scale-105 transition-transform"
            >
              <RotateCcw className="w-6 h-6" />
              Scan Again
            </button>
          </div>
        ) : (
          <Camera 
            onCapture={handleCapture} 
            isProcessing={detectCurrency.isPending}
            label="Currency Counter"
          />
        )}
      </main>
    </div>
  );
}
