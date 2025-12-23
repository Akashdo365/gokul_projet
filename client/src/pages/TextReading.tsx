import { useState } from "react";
import { Header } from "@/components/Header";
import { Camera } from "@/components/Camera";
import { useAiDetection } from "@/hooks/use-ai";
import { useSpeech } from "@/hooks/use-speech";
import { RotateCcw } from "lucide-react";

export default function TextReading() {
  const [result, setResult] = useState<string | null>(null);
  const { readText } = useAiDetection();
  const { speak } = useSpeech();

  const handleCapture = (image: string) => {
    readText.mutate(image, {
      onSuccess: (data) => {
        if (!data.text.trim()) {
          const msg = "No text found.";
          setResult(msg);
          speak(msg);
        } else {
          setResult(data.text);
          speak(`Text says: ${data.text}`);
        }
      },
      onError: () => {
        const msg = "Could not read text. Try better lighting.";
        setResult(msg);
        speak(msg);
      }
    });
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      <Header title="Read Text" />
      
      <main className="flex-1 p-4 flex flex-col gap-4 overflow-hidden">
        {result ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-8 bg-secondary rounded-3xl p-8 text-center animate-in fade-in slide-in-from-bottom-4">
            <div className="max-h-[50vh] overflow-y-auto">
              <p className="text-2xl font-medium text-foreground leading-relaxed">
                {result}
              </p>
            </div>
            <button
              onClick={() => {
                setResult(null);
                speak("Ready to read again.");
              }}
              className="flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold text-xl hover:scale-105 transition-transform shrink-0"
            >
              <RotateCcw className="w-6 h-6" />
              Read Again
            </button>
          </div>
        ) : (
          <Camera 
            onCapture={handleCapture} 
            isProcessing={readText.isPending}
            label="Text Reader"
          />
        )}
      </main>
    </div>
  );
}
