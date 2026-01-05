import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock } from "lucide-react";

const quickLinks = [
  { href: "/menu", label: "Our Menu" },
  { href: "/reservations", label: "Reservations" },
  { href: "/about", label: "About Us" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const socialLinks = [
  { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
  { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
  { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
];

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center border border-white/20 bg-white">
                <img src="/images/logo.jpg" alt="Ibn Adam Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-display text-2xl font-bold text-primary-foreground">
                Pak Cuisine
              </span>
            </Link>
            <p className="text-secondary-foreground/80 leading-relaxed">
              Experience authentic Pakistani flavors crafted with love and tradition.
              Every dish tells a story of our rich culinary heritage.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-xl font-semibold mb-6 text-primary-foreground">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-secondary-foreground/80 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display text-xl font-semibold mb-6 text-primary-foreground">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-secondary-foreground/80">
                  123 Spice Street, Flavor District<br />
                  New York, NY 10001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="tel:+1234567890"
                  className="text-secondary-foreground/80 hover:text-primary transition-colors"
                >
                  (123) 456-7890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="mailto:info@pakcuisine.com"
                  className="text-secondary-foreground/80 hover:text-primary transition-colors"
                >
                  info@pakcuisine.com
                </a>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="font-display text-xl font-semibold mb-6 text-primary-foreground">
              Opening Hours
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="text-secondary-foreground/80">
                  <span className="block font-medium">Mon - Thu</span>
                  <span>11:00 AM - 10:00 PM</span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="text-secondary-foreground/80">
                  <span className="block font-medium">Fri - Sat</span>
                  <span>11:00 AM - 11:00 PM</span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="text-secondary-foreground/80">
                  <span className="block font-medium">Sunday</span>
                  <span>12:00 PM - 9:00 PM</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-foreground/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-secondary-foreground/60">
            <p>© {new Date().getFullYear()} Pak Cuisine. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
