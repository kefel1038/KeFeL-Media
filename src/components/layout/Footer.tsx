import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import { categories } from "@/data/categories";
import { siteConfig } from "@/lib/seo";

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

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=100063718801347", Icon: FacebookIcon },
  { label: "X / Twitter", href: "#", Icon: XIcon },
  { label: "Instagram", href: "#", Icon: InstagramIcon },
  { label: "YouTube", href: "https://www.youtube.com/@KefelMedia", Icon: YoutubeIcon },
  { label: "TikTok", href: "#", Icon: TikTokIcon },
];

const footerSections = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Advertise", href: "/advertise" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Editorial Standards", href: "/editorial-standards" },
      { label: "Corrections Policy", href: "/corrections" },
    ],
  },
  {
    title: "Features",
    links: [
      { label: "Fact-Checking", href: "/fact-checking" },
      { label: "Podcasts", href: "/podcasts" },
      { label: "Videos", href: "/videos" },
      { label: "RSS Feed", href: "/rss.xml" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign In", href: "/signin" },
      { label: "Subscribe", href: "/subscribe" },
      { label: "Admin Login", href: "/admin/login" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-gray-400 mt-16 border-t border-[var(--card-border)]">
      {/* Newsletter Banner */}
      <div className="bg-brand-dark/10 border-b border-white/5 py-10">
        <div className="max-w-screen-xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-white font-bold text-xl font-headline tracking-wide">
              Stay Informed. Subscribe to KeFeL Media.
            </h3>
            <p className="text-gray-400 text-sm mt-2">
              Daily briefings on Africa&apos;s biggest stories, straight to your inbox.
            </p>
          </div>
          <form className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-80">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 pl-11 pr-4 py-3 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 transition-all"
              />
            </div>
            <button
              type="submit"
              className="bg-brand-primary hover:bg-brand-dark text-white font-semibold text-sm px-6 py-3 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap tracking-wide uppercase"
            >
              Subscribe <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-screen-xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 bg-brand-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-xl">K</span>
              </div>
              <div className="flex items-baseline gap-[2px]">
                <span className="text-white font-black text-xl font-headline">KEFEL</span>
                <span className="text-brand-primary font-black text-xl">.</span>
                <span className="text-white font-black text-xl font-headline">MEDIA</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 mb-6 font-serif italic max-w-sm">
              &ldquo;Informing, Inspiring, Connecting Africa and the World. Bringing you
              the stories that matter, with depth and integrity.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand-primary transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6 border-l-2 border-brand-primary pl-3">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white hover:pl-1 transition-all duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Categories Quick Links */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 text-center">
            Sections
          </h4>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="text-xs text-gray-500 hover:text-white px-3 py-1.5 rounded-full border border-white/10 hover:border-white/30 transition-all duration-200"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10 bg-black/50">
        <div className="max-w-screen-xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All Rights Reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/editorial-standards" className="hover:text-white transition-colors">Editorial Standards</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
