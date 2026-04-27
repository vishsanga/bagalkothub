import { useEffect, useState } from "react";
import { Menu, X, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/#home", label: "Home" },
  { href: "/#categories", label: "Categories" },
  { href: "/#talukas", label: "Talukas" },
  { href: "/#featured", label: "Featured" },
  { href: "/#news", label: "Updates" },
  { href: "/#submit", label: "List Business" },
  { href: "/#contact", label: "Contact" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled ? "py-3" : "py-5"
      )}
    >
      <div className="container">
        <nav
          className={cn(
            "glass rounded-2xl flex items-center justify-between gap-4 transition-all duration-500",
            scrolled ? "px-4 py-2.5" : "px-5 py-3"
          )}
        >
          <a href="/#home" className="flex items-center gap-2.5 group">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-gold shadow-gold">
              <MapPin className="h-4 w-4 text-gold-foreground" strokeWidth={2.5} />
            </span>
            <div className="leading-tight">
              <div className="font-display text-base md:text-lg text-foreground">
                Bagalkot <span className="gold-text">City Hub</span>
              </div>
              <div className="hidden sm:block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Discover · Connect · Grow
              </div>
            </div>
          </a>

          <ul className="hidden lg:flex items-center gap-7 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="nav-link">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden lg:block">
            <a
              href="/#submit"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-5 py-2.5 text-sm font-semibold text-gold-foreground shadow-gold transition-transform hover:scale-[1.03]"
            >
              Add Listing
            </a>
          </div>

          <button
            type="button"
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 text-foreground"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {open && (
          <div className="lg:hidden glass-strong rounded-2xl mt-2 p-5 animate-fade-in">
            <ul className="flex flex-col gap-1">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-3 text-sm text-foreground/90 hover:bg-secondary/60 transition"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <a
                  href="/#submit"
                  onClick={() => setOpen(false)}
                  className="block text-center rounded-full bg-gradient-gold px-5 py-3 text-sm font-semibold text-gold-foreground shadow-gold"
                >
                  Add Listing
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};
