import { Link } from "react-router-dom";
import { MapPin, Mail, Phone, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { TALUKAS } from "@/data/talukas";

const linkCls = "text-sm text-muted-foreground hover:text-gold transition-colors";

export const Footer = () => {
  return (
    <footer id="contact" className="relative pt-20 pb-8 border-t border-border/40">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-gold shadow-gold">
                <MapPin className="h-4 w-4 text-gold-foreground" strokeWidth={2.5} />
              </span>
              <div className="font-display text-lg text-foreground">
                Bagalkot <span className="gold-text">City Hub</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              The premium directory for everything happening in Bagalkot. Discover, connect, and grow with the city.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {[
                { Icon: Facebook, href: "#", label: "Facebook" },
                { Icon: Instagram, href: "#", label: "Instagram" },
                { Icon: Twitter, href: "#", label: "Twitter" },
                { Icon: Youtube, href: "#", label: "YouTube" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="glass flex h-10 w-10 items-center justify-center rounded-full hover:border-gold/50 transition-all hover:-translate-y-0.5"
                >
                  <Icon className="h-4 w-4 text-foreground/80 hover:text-gold transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-base text-foreground mb-4">Quick Links</h4>
            <ul className="flex flex-col gap-2.5">
              <li><a href="#home" className={linkCls}>Home</a></li>
              <li><a href="#categories" className={linkCls}>Categories</a></li>
              <li><a href="#featured" className={linkCls}>Featured</a></li>
              <li><a href="#news" className={linkCls}>Updates</a></li>
              <li><a href="#submit" className={linkCls}>List Business</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display text-base text-foreground mb-4">Categories</h4>
            <ul className="flex flex-col gap-2.5">
              <li><a href="#categories" className={linkCls}>Restaurants</a></li>
              <li><a href="#categories" className={linkCls}>Gyms</a></li>
              <li><a href="#categories" className={linkCls}>Services</a></li>
              <li><a href="#categories" className={linkCls}>Jobs</a></li>
              <li><a href="#categories" className={linkCls}>Events</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-base text-foreground mb-4">Contact</h4>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                <span>Sector 25, Navanagar, Bagalkot, Karnataka 587103</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-gold shrink-0" />
                <a href="tel:+919000000000" className="hover:text-gold transition-colors">+91 90000 00000</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-gold shrink-0" />
                <a href="mailto:hello@bagalkotcityhub.in" className="hover:text-gold transition-colors">hello@bagalkotcityhub.in</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Bagalkot City Hub. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Made with <span className="text-gold">★</span> for Bagalkot
          </p>
        </div>
      </div>
    </footer>
  );
};
