import type { Metadata } from "next";
import { Inter, Playfair_Display, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { generateOrganizationJsonLd, generateWebSiteJsonLd, siteConfig } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });
const arabic = Noto_Naskh_Arabic({ subsets: ["arabic"], variable: "--font-noto-naskh", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    template: `%s | ${siteConfig.name}`,
    default: `${siteConfig.name} — Informing, Inspiring, Connecting Africa and the World`,
  },
  description: siteConfig.description,
  keywords: [
    "Africa news", "Uganda news", "African journalism", "KeFeL Media",
    "breaking news Africa", "East African news", "Kampala news",
    "African technology", "African business", "African politics",
  ],
  authors: [{ name: "KeFeL Media Editorial Team" }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Informing, Inspiring, Connecting Africa and the World`,
    description: "Africa's premier digital news platform. Breaking news, analysis, and stories from Uganda, Africa, and the world.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "KeFeL Media" }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: "Africa's premier digital news platform.",
    creator: siteConfig.twitter,
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
    types: {
      "application/rss+xml": `${siteConfig.url}/rss.xml`,
      "application/atom+xml": `${siteConfig.url}/atom.xml`,
    },
  },
};

const organizationJsonLd = generateOrganizationJsonLd();
const webSiteJsonLd = generateWebSiteJsonLd();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} ${arabic.variable} font-sans antialiased min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]`}>
        <ThemeProvider defaultTheme="system">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
