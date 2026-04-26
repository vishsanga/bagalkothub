import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  action?: React.ReactNode;
  className?: string;
};

export const SectionHeading = ({ eyebrow, title, description, align = "left", action, className }: Props) => {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={cn(
        "reveal flex flex-col gap-4 mb-10 md:mb-14",
        align === "center" ? "items-center text-center" : "items-start",
        action && "md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div className={cn("flex flex-col gap-3", align === "center" && "items-center")}>
        {eyebrow && (
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold font-medium">
            <span className="h-px w-8 bg-gradient-gold" />
            {eyebrow}
          </span>
        )}
        <h2 className="font-display text-3xl md:text-5xl text-foreground leading-tight max-w-3xl">
          {title}
        </h2>
        {description && (
          <p className="text-muted-foreground max-w-2xl text-base md:text-lg">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
};
