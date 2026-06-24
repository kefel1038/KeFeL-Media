import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import { categories } from "@/data/categories";

// Inline brand SVGs (lucide-react v4 removed these)
const FacebookIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const XIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const InstagramIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);
const YoutubeIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.5C5.12 20 12 20 12 20s6.88 0 8.59-.5a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
  </svg>
);
const TikTokIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
  </svg>
);

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Advertise", href: "/advertise" },
  { label: "Careers", href: "/careers" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
];

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=100063718801347", Icon: FacebookIcon },
  { label: "X / Twitter", href: "#", Icon: XIcon },
  { label: "Instagram", href: "#", Icon: InstagramIcon },
  { label: "YouTube", href: "https://www.youtube.com/@KefelMedia", Icon: YoutubeIcon },
  { label: "TikTok", href: "#", Icon: TikTokIcon },
];

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-gray-400 mt-16">
      {/* Newsletter Banner */}
      <div className="bg-brand/10 border-t border-b border-brand/20 py-8">
        <div className="max-w-screen-xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-bold text-lg">
              Stay Informed. Subscribe to KeFeL Media.
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              Daily briefings on Africa's biggest stories, straight to your inbox.
            </p>
          </div>
          <form className="flex w-full sm:w-auto gap-2">
            <div className="relative flex-1 sm:w-72">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white/10 border border-white/20 rounded text-white text-sm placeholder-gray-500 pl-9 pr-4 py-2.5 focus:outline-none focus:border-brand transition-colors"
              />
            </div>
            <button
              type="submit"
              className="bg-brand hover:bg-orange-600 text-white font-semibold text-sm px-5 py-2.5 rounded transition-colors flex items-center gap-1 whitespace-nowrap"
            >
              Subscribe <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-screen-xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand rounded-sm flex items-center justify-center">
                <span className="text-white font-black text-lg">K</span>
              </div>
              <div className="flex items-baseline gap-[2px]">
                <span className="text-white font-black text-lg">KEFEL</span>
                <span className="text-brand font-black text-lg">.</span>
                <span className="text-white font-black text-lg">MEDIA</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500 mb-4">
              Informing, Inspiring, Connecting Africa and the World. Bringing you
              the stories that matter, with depth and integrity.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-gray-500 hover:text-white hover:border-brand hover:bg-brand/20 transition-all"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/${cat.slug}`}
                    className="text-sm hover:text-brand transition-colors flex items-center gap-1.5"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${cat.color}`} />
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-brand transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow & Download */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Follow Us
            </h4>
            <div className="space-y-3">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm hover:text-white transition-colors group"
                >
                  <div className="w-7 h-7 rounded bg-white/5 group-hover:bg-brand/20 flex items-center justify-center transition-colors">
                    <Icon size={13} />
                  </div>
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <p>© 2026 KeFeL Media. All Rights Reserved.</p>
          <p>
            Informing, Inspiring, Connecting Africa and the World
          </p>
        </div>
      </div>
    </footer>
  );
}
