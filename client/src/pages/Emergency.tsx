import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { useSpeech } from "@/hooks/use-speech";
import { useUser } from "@/hooks/use-user";
import { useEmergency } from "@/hooks/use-emergency";
import { Phone, MapPin, Loader2, CheckCircle, AlertTriangle } from "lucide-react";

export default function Emergency() {
  const { speak } = useSpeech();
  const { user, isLoading: isUserLoading } = useUser();
  const { mutate: triggerEmergency, isPending, isSuccess } = useEmergency();
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    speak("Emergency mode active. Double tap the red button to call for help.");
  }, []);

  const handleEmergency = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported");
      triggerWithoutLocation();
      return;
    }

    speak("Getting location and sending alert...");
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        triggerEmergency({
          locationLat: position.coords.latitude.toString(),
          locationLng: position.coords.longitude.toString(),
          status: "triggered"
        }, {
          onSuccess: () => {
            speak("Alert sent. Calling contact now.");
            if (user?.emergencyContact) {
              window.location.href = `tel:${user.emergencyContact}`;
            } else {
              speak("No emergency contact saved. Please add one in profile.");
            }
          }
        });
      },
      (err) => {
        setLocationError(err.message);
        triggerWithoutLocation();
      }
    );
  };

  const triggerWithoutLocation = () => {
    triggerEmergency({
      status: "triggered_no_location"
    }, {
      onSuccess: () => {
        speak("Alert sent without location. Calling contact.");
        if (user?.emergencyContact) {
          window.location.href = `tel:${user.emergencyContact}`;
        }
      }
    });
  };

  const openMaps = () => {
    if (user?.address) {
      speak("Opening navigation to home.");
      const encodedAddr = encodeURIComponent(user.address);
      window.location.href = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddr}`;
    } else {
      speak("No home address saved.");
    }
  };

  if (isUserLoading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title="EMERGENCY" />
      
      <main className="max-w-md mx-auto w-full p-4 space-y-6 flex-1 flex flex-col justify-center">
        
        {isSuccess ? (
          <div className="p-8 bg-green-500/10 border border-green-500 rounded-3xl text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-green-500">Help Requested</h2>
            <p className="text-muted-foreground">Alert sent to system. Calling contact...</p>
          </div>
        ) : (
          <button
            onClick={handleEmergency}
            disabled={isPending}
            className="w-full aspect-square rounded-full bg-destructive text-destructive-foreground flex flex-col items-center justify-center gap-4 shadow-[0_0_50px_rgba(239,68,68,0.4)] animate-pulse-emergency active:scale-95 transition-transform"
          >
            {isPending ? (
              <Loader2 className="w-24 h-24 animate-spin" />
            ) : (
              <AlertTriangle className="w-24 h-24" />
            )}
            <span className="text-3xl font-black tracking-wider">
              {isPending ? "SENDING..." : "SOS"}
            </span>
          </button>
        )}

        <div className="grid grid-cols-1 gap-4 mt-8">
          <button
            onClick={() => {
              speak("Calling emergency contact");
              if (user?.emergencyContact) window.location.href = `tel:${user.emergencyContact}`;
            }}
            className="p-6 bg-secondary rounded-2xl flex items-center gap-4 hover:bg-secondary/80"
          >
            <div className="p-4 bg-primary rounded-full text-primary-foreground">
              <Phone className="w-8 h-8" />
            </div>
            <div className="text-left">
              <div className="font-bold text-lg">Call Contact</div>
              <div className="text-muted-foreground">{user?.emergencyContact || "Not set"}</div>
            </div>
          </button>

          <button
            onClick={openMaps}
            className="p-6 bg-secondary rounded-2xl flex items-center gap-4 hover:bg-secondary/80"
          >
            <div className="p-4 bg-primary rounded-full text-primary-foreground">
              <MapPin className="w-8 h-8" />
            </div>
            <div className="text-left">
              <div className="font-bold text-lg">Navigate Home</div>
              <div className="text-muted-foreground text-sm line-clamp-1">{user?.address || "Address not set"}</div>
            </div>
          </button>
        </div>

        {locationError && (
          <p className="text-red-500 text-center text-sm">Location error: {locationError}</p>
        )}
      </main>
    </div>
  );
}
