import { Metadata } from "next";

export const siteConfig = {
  name: "KeFeL Media",
  shortName: "KeFeL",
  description: "Informing, Inspiring, Connecting Africa and the World. Africa's premier digital news platform.",
  url: "https://kefelmedia.com",
  ogImage: "https://kefelmedia.com/og-image.jpg",
  logo: "https://kefelmedia.com/logo.png",
  locale: "en_US",
  type: "website",
  twitter: "@KeFeLMedia",
  links: {
    twitter: "https://twitter.com/KeFeLMedia",
    facebook: "https://facebook.com/kefelmedia",
    instagram: "https://instagram.com/kefelmedia",
    youtube: "https://youtube.com/@KefelMedia",
    linkedin: "https://linkedin.com/company/kefelmedia",
  },
  contact: {
    email: "editorial@kefelmedia.com",
    phone: "+256 700 000 000",
    address: "Kampala, Uganda",
  },
  organization: {
    name: "KeFeL Media",
    url: "https://kefelmedia.com",
    logo: "https://kefelmedia.com/logo.png",
    foundingDate: "2024",
    founders: [{ name: "KeFeL Media Team" }],
    sameAs: [
      "https://facebook.com/kefelmedia",
      "https://twitter.com/KeFeLMedia",
      "https://instagram.com/kefelmedia",
      "https://youtube.com/@KefelMedia",
      "https://linkedin.com/company/kefelmedia",
    ],
  },
};

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  url = siteConfig.url,
  noIndex = false,
  type = "website" as const,
  publishedTime,
  modifiedTime,
  authors,
  tags,
}: {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  noIndex?: boolean;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      locale: siteConfig.locale,
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors && { authors }),
      ...(tags && { tags }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: siteConfig.twitter,
      site: siteConfig.twitter,
    },
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical: url },
    ...(noIndex && {
      robots: { index: false, follow: false },
    }),
  };
}

// JSON-LD Generators

export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: siteConfig.organization.name,
    url: siteConfig.organization.url,
    logo: siteConfig.organization.logo,
    foundingDate: siteConfig.organization.foundingDate,
    founders: siteConfig.organization.founders,
    sameAs: siteConfig.organization.sameAs,
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.contact.email,
      contactType: "editorial",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kampala",
      addressCountry: "UG",
    },
  };
}

export function generateWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: siteConfig.logo },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateArticleJsonLd(article: {
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  image: string;
  publishedAt: string;
  updatedAt?: string;
  author: { name: string; avatar?: string; role?: string; bio?: string };
  category: string;
  tags?: string[];
  wordCount?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: [article.image],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: [
      {
        "@type": "Person",
        name: article.author.name,
        ...(article.author.avatar && { image: article.author.avatar }),
        ...(article.author.bio && { description: article.author.bio }),
        url: `${siteConfig.url}/author/${encodeURIComponent(article.author.name.toLowerCase().replace(/\s+/g, "-"))}`,
      },
    ],
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: siteConfig.logo,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/article/${article.slug}`,
    },
    articleSection: article.category,
    keywords: article.tags?.join(", "),
    wordCount: article.wordCount,
    inLanguage: "en",
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateCategoryJsonLd(category: {
  name: string;
  description: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} - ${siteConfig.name}`,
    description: category.description,
    url: `${siteConfig.url}/category/${category.slug}`,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: siteConfig.logo },
    },
  };
}

export function generateFaqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateVideoJsonLd(video: {
  title: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string;
  contentUrl?: string;
  embedUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.uploadDate,
    ...(video.duration && { duration: video.duration }),
    ...(video.contentUrl && { contentUrl: video.contentUrl }),
    ...(video.embedUrl && { embedUrl: video.embedUrl }),
  };
}
