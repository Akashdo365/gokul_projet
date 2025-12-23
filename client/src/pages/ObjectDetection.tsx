import { useState } from "react";
import { Header } from "@/components/Header";
import { Camera } from "@/components/Camera";
import { useAiDetection } from "@/hooks/use-ai";
import { useSpeech } from "@/hooks/use-speech";
import { RotateCcw } from "lucide-react";

export default function ObjectDetection() {
  const [result, setResult] = useState<string | null>(null);
  const { detectObject } = useAiDetection();
  const { speak } = useSpeech();

  const handleCapture = (image: string) => {
    detectObject.mutate(image, {
      onSuccess: (data) => {
        if (data.objects.length === 0) {
          const msg = "No objects identified clearly.";
          setResult(msg);
          speak(msg);
        } else {
          // Format: "I see a Chair (90%), Table (80%)"
          const descriptions = data.objects
            .map(obj => `${obj.name}`)
            .join(", ");
          
          const msg = `I see: ${descriptions}`;
          setResult(msg);
          speak(msg);
        }
      },
      onError: () => {
        const msg = "Error identifying objects. Please try again.";
        setResult(msg);
        speak(msg);
      }
    });
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      <Header title="Object ID" />
      
      <main className="flex-1 p-4 flex flex-col gap-4 overflow-hidden">
        {result ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-8 bg-secondary rounded-3xl p-8 text-center animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-4xl font-bold text-primary leading-tight">
              {result}
            </h2>
            <button
              onClick={() => {
                setResult(null);
                speak("Ready to scan again.");
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
            isProcessing={detectObject.isPending}
            label="Object Identification"
          />
        )}
      </main>
    </div>
  );
}
