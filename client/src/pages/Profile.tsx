import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "@shared/routes";
import { Header } from "@/components/Header";
import { useUser } from "@/hooks/use-user";
import { useSpeech } from "@/hooks/use-speech";
import { Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { user, updateUser, isUpdating, isLoading } = useUser();
  const { speak } = useSpeech();
  const { toast } = useToast();

  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      name: "",
      address: "",
      emergencyContact: "",
      alternateContact: "",
      language: "en"
    }
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        address: user.address || "",
        emergencyContact: user.emergencyContact,
        alternateContact: user.alternateContact || "",
        language: user.language || "en"
      });
    }
  }, [user, form]);

  const onSubmit = (data: InsertUser) => {
    updateUser(data, {
      onSuccess: () => {
        speak("Profile updated successfully.");
        toast({ title: "Saved", description: "Profile updated successfully" });
      },
      onError: (err) => {
        speak("Failed to save profile.");
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <Header title="My Profile" />

      <main className="max-w-md mx-auto p-4">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="space-y-2">
            <label className="text-lg font-semibold text-foreground">Full Name</label>
            <input
              {...form.register("name")}
              className="w-full p-4 rounded-xl bg-secondary border-2 border-border text-foreground focus:border-primary focus:ring-0 text-lg"
              placeholder="Your name"
              onFocus={() => speak("Enter full name")}
            />
            {form.formState.errors.name && (
              <p className="text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-lg font-semibold text-foreground">Home Address</label>
            <textarea
              {...form.register("address")}
              className="w-full p-4 rounded-xl bg-secondary border-2 border-border text-foreground focus:border-primary focus:ring-0 text-lg min-h-[100px]"
              placeholder="Full address for navigation"
              onFocus={() => speak("Enter home address")}
            />
          </div>

          <div className="space-y-2">
            <label className="text-lg font-semibold text-foreground">Emergency Contact</label>
            <input
              {...form.register("emergencyContact")}
              type="tel"
              className="w-full p-4 rounded-xl bg-secondary border-2 border-border text-foreground focus:border-primary focus:ring-0 text-lg"
              placeholder="+1234567890"
              onFocus={() => speak("Enter emergency phone number")}
            />
            {form.formState.errors.emergencyContact && (
              <p className="text-destructive">{form.formState.errors.emergencyContact.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-lg font-semibold text-foreground">Alternate Contact</label>
            <input
              {...form.register("alternateContact")}
              type="tel"
              className="w-full p-4 rounded-xl bg-secondary border-2 border-border text-foreground focus:border-primary focus:ring-0 text-lg"
              placeholder="+1234567890"
              onFocus={() => speak("Enter alternate contact number")}
            />
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="w-full py-5 rounded-xl bg-primary text-primary-foreground font-bold text-xl shadow-lg hover:brightness-110 active:scale-[0.99] flex items-center justify-center gap-3 transition-all"
            onClick={() => speak("Saving profile")}
          >
            {isUpdating ? <Loader2 className="animate-spin" /> : <Save />}
            Save Profile
          </button>
        </form>
      </main>
    </div>
  );
}
