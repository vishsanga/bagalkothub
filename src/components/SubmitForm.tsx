import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Check, Send, Loader2 } from "lucide-react";
import { AREAS, CATEGORIES } from "@/data/cityData";
import { SectionHeading } from "./SectionHeading";
import { useReveal } from "@/hooks/useReveal";

const submissionSchema = z.object({
  businessName: z.string().trim().min(2, "Business name is too short").max(100),
  category: z.string().min(1, "Please select a category"),
  ownerName: z.string().trim().min(2, "Owner name is required").max(80),
  phone: z.string().trim().regex(/^[+\d\s\-()]{7,20}$/, "Enter a valid phone number"),
  email: z.string().trim().email("Enter a valid email").max(255),
  area: z.string().min(1, "Select an area"),
  description: z.string().trim().min(20, "Tell us a bit more (20+ chars)").max(500),
});

type FormState = z.infer<typeof submissionSchema>;
type FormErrors = Partial<Record<keyof FormState, string>>;

const empty: FormState = {
  businessName: "",
  category: "",
  ownerName: "",
  phone: "",
  email: "",
  area: "",
  description: "",
};

const benefits = [
  "Get discovered by 10,000+ monthly visitors",
  "Verified badge after manual review",
  "Free analytics on profile views and clicks",
  "Promote events, offers and openings",
];

export const SubmitForm = () => {
  const ref = useReveal<HTMLDivElement>();
  const [data, setData] = useState<FormState>(empty);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = submissionSchema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors: FormErrors = {};
      parsed.error.issues.forEach((i) => {
        const key = i.path[0] as keyof FormState;
        if (!fieldErrors[key]) fieldErrors[key] = i.message;
      });
      setErrors(fieldErrors);
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    toast.success("Submission received!", {
      description: "Our team will review and get in touch within 48 hours.",
    });
    setData(empty);
  };

  return (
    <section id="submit" className="py-20 md:py-28 bg-gradient-cream relative">
      <div className="absolute inset-x-0 top-0 rule-gold" />
      <div className="container grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Pitch */}
        <div ref={ref} className="reveal flex flex-col gap-6 lg:sticky lg:top-28">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold font-medium">
            <span className="h-px w-8 bg-gradient-gold" />
            For Business Owners
          </span>
          <h2 className="font-display text-3xl md:text-5xl text-foreground leading-tight">
            List Your Business.
            <br />
            <span className="gold-text italic">Reach Thousands.</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-md">
            Join 500+ Bagalkot businesses already growing on the city's most trusted directory.
          </p>
          <ul className="flex flex-col gap-3 mt-2">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-gold shadow-gold">
                  <Check className="h-3.5 w-3.5 text-gold-foreground" strokeWidth={3} />
                </span>
                <span className="text-foreground/90">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="glass-strong rounded-3xl p-6 md:p-8 flex flex-col gap-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Business name" error={errors.businessName}>
              <input
                value={data.businessName}
                onChange={(e) => update("businessName", e.target.value)}
                placeholder="e.g. Saraswati Restaurant"
                className={inputCls}
                maxLength={100}
              />
            </Field>
            <Field label="Category" error={errors.category}>
              <select
                value={data.category}
                onChange={(e) => update("category", e.target.value)}
                className={inputCls}
              >
                <option value="" className="bg-background-elevated">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.name} className="bg-background-elevated">
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Owner name" error={errors.ownerName}>
              <input
                value={data.ownerName}
                onChange={(e) => update("ownerName", e.target.value)}
                placeholder="Your full name"
                className={inputCls}
                maxLength={80}
              />
            </Field>
            <Field label="Phone" error={errors.phone}>
              <input
                value={data.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+91 9XXXX XXXXX"
                className={inputCls}
                maxLength={20}
              />
            </Field>
            <Field label="Email" error={errors.email}>
              <input
                type="email"
                value={data.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@business.com"
                className={inputCls}
                maxLength={255}
              />
            </Field>
            <Field label="Area" error={errors.area}>
              <select
                value={data.area}
                onChange={(e) => update("area", e.target.value)}
                className={inputCls}
              >
                <option value="" className="bg-background-elevated">Select area</option>
                {AREAS.filter((a) => a !== "All Areas").map((a) => (
                  <option key={a} value={a} className="bg-background-elevated">
                    {a}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Short description" error={errors.description}>
            <textarea
              value={data.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="What makes your business special? (20–500 characters)"
              rows={4}
              maxLength={500}
              className={`${inputCls} resize-none`}
            />
            <div className="text-[11px] text-muted-foreground mt-1 text-right">
              {data.description.length}/500
            </div>
          </Field>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-gold px-6 py-3.5 text-sm font-semibold text-gold-foreground shadow-gold transition-transform hover:scale-[1.02] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
              </>
            ) : (
              <>
                Submit Listing <Send className="h-4 w-4" />
              </>
            )}
          </button>
          <p className="text-[11px] text-muted-foreground text-center">
            By submitting you agree to our review process. We'll never share your details.
          </p>
        </form>
      </div>
    </section>
  );
};

const inputCls =
  "w-full bg-input/60 border border-border/60 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20 transition";

const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-xs font-medium text-foreground/80 uppercase tracking-wider">{label}</span>
    {children}
    {error && <span className="text-xs text-destructive">{error}</span>}
  </label>
);
