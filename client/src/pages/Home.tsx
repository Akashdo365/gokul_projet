import { Link } from "wouter";
import { Eye, Type, Coins, AlertTriangle, History, User } from "lucide-react";
import { BigButton } from "@/components/BigButton";
import { Header } from "@/components/Header";
import { useSpeech } from "@/hooks/use-speech";
import { useEffect } from "react";

export default function Home() {
  const { speak } = useSpeech();

  useEffect(() => {
    // Announce app name on load
    speak("Vision Assist Ready. Select a mode.");
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground pb-8">
      <Header title="Vision Assist" showBack={false} />

      <main className="max-w-md mx-auto p-4 space-y-4">
        <section className="grid grid-cols-2 gap-4">
          <Link href="/object-detection" className="col-span-2">
            <BigButton 
              icon={Eye} 
              label="Identify Object" 
              variant="primary"
              description="Identify objects around you using the camera"
              className="h-48 text-2xl"
            />
          </Link>
          
          <Link href="/text-reading">
            <BigButton 
              icon={Type} 
              label="Read Text" 
              description="Read text from signs or documents"
            />
          </Link>

          <Link href="/currency">
            <BigButton 
              icon={Coins} 
              label="Currency" 
              description="Identify paper currency notes"
            />
          </Link>
        </section>

        <section className="pt-2">
          <Link href="/emergency">
            <BigButton 
              icon={AlertTriangle} 
              label="Emergency Help" 
              variant="danger"
              description="Send emergency alert and call contact"
              className="h-32 text-xl"
            />
          </Link>
        </section>

        <section className="grid grid-cols-2 gap-4 pt-2">
           <Link href="/history">
            <BigButton 
              icon={History} 
              label="History" 
              description="View past scans"
              className="h-32"
            />
          </Link>
          <Link href="/profile">
            <BigButton 
              icon={User} 
              label="Profile" 
              description="Manage your settings and contacts"
              className="h-32"
            />
          </Link>
        </section>
      </main>
    </div>
  );
}
