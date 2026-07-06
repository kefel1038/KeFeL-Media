import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://kefelmedia.com"),
  title: { template: "%s | KeFeL Media", default: "KeFeL Media — Informing, Inspiring, Connecting Africa and the World" },
  description: "KeFeL Media is Africa's premier digital news platform, delivering breaking news, in-depth analysis, and compelling stories from Uganda, Africa, and the world.",
  keywords: ["Africa news", "Uganda news", "African journalism", "KeFeL Media", "breaking news Africa"],
  authors: [{ name: "KeFeL Media Editorial Team" }],
  creator: "KeFeL Media",
  publisher: "KeFeL Media",
  openGraph: {
    type: "website", locale: "en_US", url: "https://kefelmedia.com", siteName: "KeFeL Media",
    title: "KeFeL Media — Informing, Inspiring, Connecting Africa and the World",
    description: "Africa's premier digital news platform. Breaking news, analysis, and stories from Uganda, Africa, and the world.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "KeFeL Media" }],
  },
  twitter: {
    card: "summary_large_image", title: "KeFeL Media",
    description: "Africa's premier digital news platform.", creator: "@KeFeLMedia",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-[#F9F9F9] dark:bg-[#1A1A1A] text-zinc-900 dark:text-zinc-100 transition-colors duration-300 antialiased min-h-screen flex flex-col`}>
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if (typeof window !== 'undefined' && window.localStorage) {
                    var stored = window.localStorage.getItem('theme');
                    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (stored === 'dark' || (!stored && prefersDark)) {
                      document.documentElement.classList.add('dark');
                    }
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
