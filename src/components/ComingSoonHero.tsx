import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Sparkles, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "@/hooks/useLocation";
import heroImg from "@/assets/hero-bagalkot.jpg";

const emailSchema = z.string().trim().email("Enter a valid email").max(255);

export const ComingSoonHero = () => {
  const { address, coords } = useLocation();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const cityLabel = address?.city || address?.district || "your city";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid email");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("waitlist_signups").insert({
      email: parsed.data,
      city: address?.city ?? null,
      state: address?.state ?? null,
      country: address?.country ?? null,
      lat: coords?.lat ?? null,
      lng: coords?.lng ?? null,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 500) : null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not join the waitlist. Please try again.");
      return;
    }
    setDone(true);
    toast.success("You're on the list!", { description: "We'll email you when we launch in your city." });
  };

  return (
    <section className="relative isolate overflow-hidden pt-32 md:pt-40 pb-20 md:pb-28">
      <div className="absolute inset-0 -z-10">
        <img src={heroImg} alt="City skyline" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background via-background/70 to-transparent" />
      </div>
      <div className="container relative">
        <div className="max-w-3xl flex flex-col items-start gap-6 animate-fade-up">
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs md:text-sm">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            <span className="text-foreground/85">Hyperlocal city operating system</span>
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.05] text-foreground">
            We're <span className="gold-text">coming soon</span>
            <br />
            <span className="italic font-medium text-foreground/90">to {cityLabel}.</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
            City Hub is live in Bagalkot district today. Drop your email and we'll let you know the moment we launch
            local businesses, news and services in {cityLabel}.
          </p>

          {done ? (
            <div className="glass-strong rounded-2xl px-5 py-4 flex items-center gap-3">
              <MapPin className="h-5 w-5 text-gold" />
              <p className="text-sm text-foreground">You're on the list for {cityLabel}. Talk soon!</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="glass-strong rounded-full p-2 flex items-stretch gap-2 w-full max-w-xl">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@city.com"
                className="bg-transparent flex-1 px-4 py-2 text-sm outline-none text-foreground placeholder:text-muted-foreground"
                maxLength={255}
                required
              />
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-5 py-2.5 text-sm font-semibold text-gold-foreground shadow-gold disabled:opacity-70"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Join waitlist
              </button>
            </form>
          )}

          <p className="text-xs text-muted-foreground">
            Want to explore the platform anyway? Browse Bagalkot below — switch your city anytime from the top bar.
          </p>
        </div>
      </div>
    </section>
  );
};
