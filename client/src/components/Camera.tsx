import React, { useRef, useCallback, useState } from "react";
import Webcam from "react-webcam";
import { Camera as CameraIcon, RotateCcw, X } from "lucide-react";
import { useSpeech } from "@/hooks/use-speech";

interface CameraProps {
  onCapture: (imageSrc: string) => void;
  isProcessing: boolean;
  label: string;
}

const videoConstraints = {
  width: 720,
  height: 1280,
  facingMode: "environment",
};

export function Camera({ onCapture, isProcessing, label }: CameraProps) {
  const webcamRef = useRef<Webcam>(null);
  const { speak } = useSpeech();
  const [image, setImage] = useState<string | null>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      speak("Image captured. Processing.");
      setImage(imageSrc);
      onCapture(imageSrc);
    } else {
      speak("Failed to capture image. Please try again.");
    }
  }, [webcamRef, onCapture, speak]);

  const retake = () => {
    setImage(null);
    speak("Camera ready.");
  };

  React.useEffect(() => {
    speak(`${label} camera active. Tap bottom button to capture.`);
  }, []);

  return (
    <div className="relative h-full flex flex-col bg-black rounded-3xl overflow-hidden shadow-2xl border border-border/20">
      <div className="flex-1 relative bg-zinc-900">
        {!image ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <img src={image} alt="Captured" className="absolute inset-0 w-full h-full object-cover" />
        )}
        
        {/* Viewfinder overlay */}
        {!image && (
          <div className="absolute inset-0 border-2 border-primary/30 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-primary rounded-lg opacity-50"></div>
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-white font-bold text-xl">Analyzing...</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-6 bg-background flex justify-center gap-4">
        {!image ? (
          <button
            onClick={capture}
            disabled={isProcessing}
            className="w-20 h-20 rounded-full bg-primary border-4 border-background ring-4 ring-primary hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-lg shadow-primary/20"
            aria-label="Capture photo"
          >
            <CameraIcon className="w-8 h-8 text-primary-foreground" />
          </button>
        ) : (
          <button
            onClick={retake}
            disabled={isProcessing}
            className="w-20 h-20 rounded-full bg-secondary border-4 border-background ring-4 ring-secondary hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
            aria-label="Retake photo"
          >
            <RotateCcw className="w-8 h-8 text-white" />
          </button>
        )}
      </div>
    </div>
  );
}
