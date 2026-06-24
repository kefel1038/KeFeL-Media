import { Article } from "@/lib/types";
import * as db from "@/lib/supabase-queries";

export const articles: Article[] = [
  {
    id: "1",
    slug: "african-innovation-transforming-digital-future",
    title: "African Innovation Is Transforming The Future Of Digital Technology",
    excerpt:
      "Discover the startups, entrepreneurs and groundbreaking innovations that are shaping Africa's next generation digital economy and positioning the continent as a global tech powerhouse.",
    content: `<p>Across the African continent, a quiet revolution is underway. From the high-rises of Nairobi's Silicon Savannah to the startup hubs of Lagos and Cape Town, a new generation of African innovators is rewriting the rules of what technology can achieve in the Global South.</p>
    <p>The numbers tell a compelling story. African tech startups raised over $5 billion in venture funding in 2024 alone, a figure that would have seemed impossible just a decade ago. Companies like Flutterwave, Andela, and Jumia have demonstrated that African-built solutions can compete — and win — on the global stage.</p>
    <p>"We are not waiting for the world to bring us technology. We are building it ourselves, for ourselves and for the world," says Dr. Amara Nwosu, CEO of Lagos-based fintech pioneer PayAfrica.</p>
    <h2>Mobile-First Transformation</h2>
    <p>Africa's mobile-first infrastructure has become its greatest advantage. With over 600 million smartphone users and the world's fastest-growing internet penetration rates, the continent has leapfrogged legacy systems that bog down more developed economies.</p>
    <p>Uganda's own tech scene has seen remarkable growth. Kampala-based startups are solving uniquely African challenges — from agricultural technology that helps smallholder farmers predict crop yields using satellite data, to health-tech platforms connecting rural communities with specialist doctors via telemedicine.</p>`,
    category: "technology",
    author: {
      name: "Amara Okonkwo",
      avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80",
      role: "Technology Editor",
      bio: "Amara covers African tech and innovation for KeFeL Media.",
    },
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
    publishedAt: "2026-06-24T08:00:00Z",
    readingTime: 7,
    featured: true,
    trending: true,
    tags: ["technology", "innovation", "africa", "startups"],
    views: 12400,
  },
  {
    id: "2",
    slug: "ugandas-digital-economy-new-growth-phase",
    title: "Uganda's Digital Economy Enters Bold New Growth Phase",
    excerpt:
      "Government-backed digital initiatives and private sector investment are propelling Uganda into an era of unprecedented connectivity and economic transformation.",
    content: `<p>Uganda's digital economy is experiencing its most dynamic period of growth as a combination of policy reform, infrastructure investment and private sector momentum converge to create new opportunities across every sector.</p>
    <p>The government's National Digital Transformation Strategy has unlocked over $200 million in infrastructure spending, with fibre optic cables reaching previously underserved rural areas and 5G pilots underway in Kampala and Entebbe.</p>`,
    category: "uganda",
    author: {
      name: "Grace Nakato",
      avatar: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=100&q=80",
      role: "Uganda Correspondent",
    },
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80",
    publishedAt: "2026-06-24T06:30:00Z",
    readingTime: 5,
    featured: false,
    trending: true,
    tags: ["uganda", "digital", "economy"],
    views: 8900,
  },
  {
    id: "3",
    slug: "african-startups-attract-global-investors",
    title: "African Startups Attract Record-Breaking Global Investment",
    excerpt:
      "International venture capital firms are pouring billions into African tech companies, marking a historic shift in global investment patterns.",
    content: `<p>The world's leading venture capital firms have awakened to Africa's potential. In the first quarter of 2026, African startups collectively raised $1.8 billion — the highest quarterly total in the continent's history.</p>`,
    category: "business",
    author: {
      name: "Kwame Asante",
      avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=100&q=80",
      role: "Business Correspondent",
    },
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
    publishedAt: "2026-06-24T05:00:00Z",
    readingTime: 6,
    featured: false,
    trending: true,
    tags: ["business", "investment", "startups", "africa"],
    views: 7200,
  },
  {
    id: "4",
    slug: "new-energy-technologies-transforming-communities",
    title: "New Energy Technologies Are Changing African Communities Forever",
    excerpt:
      "Solar microgrids and clean energy solutions are bringing reliable power to millions of Africans who have never had access to the national grid.",
    content: `<p>In villages across sub-Saharan Africa, a quiet but profound revolution is underway. Solar microgrids, wind energy installations, and off-grid power solutions are delivering clean, reliable electricity to communities that have long been overlooked by national power infrastructure.</p>`,
    category: "africa",
    author: {
      name: "Fatima Al-Hassan",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&q=80",
      role: "Africa Correspondent",
    },
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80",
    publishedAt: "2026-06-23T18:00:00Z",
    readingTime: 5,
    featured: false,
    trending: false,
    tags: ["energy", "africa", "sustainability"],
    views: 5100,
  },
  {
    id: "5",
    slug: "urban-farming-downtown-lofts",
    title: "Urban Farming Takes Off in Downtown Kampala's High-Rise Lofts",
    excerpt:
      "Innovative vertical farming techniques are transforming empty rooftops and abandoned spaces into productive urban food gardens.",
    content: `<p>Kampala's skyline is changing. Not with new office towers or luxury apartments, but with something far more revolutionary — food. A growing movement of urban farmers is converting rooftops, balconies and unused indoor spaces into productive agricultural zones.</p>`,
    category: "uganda",
    author: {
      name: "Moses Okello",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
      role: "Lifestyle Reporter",
    },
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
    publishedAt: "2026-06-23T14:00:00Z",
    readingTime: 4,
    featured: false,
    trending: true,
    tags: ["farming", "kampala", "lifestyle"],
    views: 6300,
  },
  {
    id: "6",
    slug: "global-food-festival-africa",
    title: "Global Food Festival Celebrates Africa's Diverse Culinary Heritage",
    excerpt:
      "A vibrant international food festival showcasing African cuisines from 54 nations is uniting communities and promoting cultural exchange.",
    content: `<p>From the injera flatbreads of Ethiopia to the jollof rice of West Africa, from the tagines of Morocco to the nyama choma of East Africa — the Global African Food Festival is a celebration of the continent's extraordinary culinary diversity.</p>`,
    category: "entertainment",
    author: {
      name: "Zara Mensah",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
      role: "Culture Editor",
    },
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
    publishedAt: "2026-06-23T10:00:00Z",
    readingTime: 5,
    featured: false,
    trending: true,
    tags: ["culture", "food", "africa", "festival"],
    views: 9100,
  },
  {
    id: "7",
    slug: "connecting-communities-through-sports",
    title: "How Sports Is Building Bridges Across Africa's Diverse Communities",
    excerpt:
      "Community sports programs are proving to be powerful tools for social cohesion, youth development, and cross-cultural understanding.",
    content: `<p>In a continent of 54 nations and over 2,000 languages, sport has emerged as a universal language that transcends boundaries and builds bridges between communities.</p>`,
    category: "sports",
    author: {
      name: "David Osei",
      avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&q=80",
      role: "Sports Editor",
    },
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    publishedAt: "2026-06-23T08:00:00Z",
    readingTime: 6,
    featured: false,
    trending: true,
    tags: ["sports", "community", "africa"],
    views: 7800,
  },
  {
    id: "8",
    slug: "kampala-smart-city-initiative",
    title: "Kampala Launches Ambitious Smart City Initiative",
    excerpt:
      "The Ugandan capital is rolling out smart traffic management, digital governance, and IoT infrastructure in a landmark urban modernisation plan.",
    content: `<p>Kampala Metropolitan Authority has unveiled its most ambitious urban development plan in decades, a comprehensive smart city blueprint that will transform the capital into one of Africa's most technologically advanced cities.</p>`,
    category: "uganda",
    author: {
      name: "Grace Nakato",
      avatar: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=100&q=80",
      role: "Uganda Correspondent",
    },
    image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80",
    publishedAt: "2026-06-22T12:00:00Z",
    readingTime: 4,
    featured: false,
    trending: false,
    tags: ["kampala", "smart-city", "technology"],
    views: 4200,
  },
  {
    id: "9",
    slug: "africa-climate-summit-2026",
    title: "Africa Climate Summit 2026: Leaders Commit to Bold Green Targets",
    excerpt:
      "African heads of state have made unprecedented climate pledges at the continent's most significant environmental summit in a generation.",
    content: `<p>In a landmark gathering of African heads of state, environment ministers and climate scientists, the Africa Climate Summit 2026 produced a historic set of commitments that observers are calling the most significant environmental accord ever agreed on the continent.</p>`,
    category: "africa",
    author: {
      name: "Fatima Al-Hassan",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&q=80",
      role: "Africa Correspondent",
    },
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80",
    publishedAt: "2026-06-22T08:00:00Z",
    readingTime: 7,
    featured: false,
    trending: false,
    tags: ["climate", "africa", "environment"],
    views: 5600,
  },
  {
    id: "10",
    slug: "nile-basin-water-cooperation",
    title: "Nile Basin Nations Sign Historic Water-Sharing Agreement",
    excerpt:
      "Ten countries sharing the Nile River have reached a breakthrough agreement on water allocation, ending decades of diplomatic tensions.",
    content: `<p>After more than thirty years of negotiations, the ten nations sharing the Nile River basin have signed a landmark water-sharing framework that experts say could serve as a model for international resource diplomacy worldwide.</p>`,
    category: "africa",
    author: {
      name: "Amara Okonkwo",
      avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80",
      role: "Africa Editor",
    },
    image: "https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?w=800&q=80",
    publishedAt: "2026-06-21T15:00:00Z",
    readingTime: 5,
    featured: false,
    trending: false,
    tags: ["africa", "diplomacy", "water"],
    views: 3900,
  },
  {
    id: "11",
    slug: "afcfta-trade-boost-2026",
    title: "AfCFTA Delivers First Major Trade Surge Across African Nations",
    excerpt:
      "The African Continental Free Trade Area is showing its first measurable impact, with intra-African trade volumes surging 34% year-on-year.",
    content: `<p>Three years after its full operational launch, the African Continental Free Trade Area is delivering on its transformative promise. New data from the African Union Commission shows intra-African trade volumes have surged by 34% in the past twelve months.</p>`,
    category: "business",
    author: {
      name: "Kwame Asante",
      avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=100&q=80",
      role: "Business Correspondent",
    },
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    publishedAt: "2026-06-21T09:00:00Z",
    readingTime: 6,
    featured: false,
    trending: false,
    tags: ["business", "trade", "africa", "afcfta"],
    views: 4700,
  },
  {
    id: "12",
    slug: "african-music-global-charts",
    title: "Afrobeats Dominates Global Music Charts for Record Third Year",
    excerpt:
      "African artists are topping charts worldwide as Afrobeats, Amapiano and Afro-fusion reshape global music tastes.",
    content: `<p>For the third consecutive year, African musical genres have dominated global streaming charts, with Afrobeats, Amapiano and Afro-fusion collectively accounting for over 15% of worldwide music streams.</p>`,
    category: "entertainment",
    author: {
      name: "Zara Mensah",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
      role: "Culture Editor",
    },
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    publishedAt: "2026-06-20T16:00:00Z",
    readingTime: 4,
    featured: false,
    trending: false,
    tags: ["music", "entertainment", "africa", "culture"],
    views: 8200,
  },
  {
    id: "13",
    slug: "africa-cup-of-nations-2026-preview",
    title: "Africa Cup of Nations 2026: The Stars to Watch This Tournament",
    excerpt:
      "As AFCON 2026 kicks off, we profile the continent's hottest talents who could light up the tournament and attract global attention.",
    content: `<p>The Africa Cup of Nations has always been the stage where the continent's greatest football talents announce themselves to the world. In 2026, the tournament promises to be the most competitive and exciting in its history.</p>`,
    category: "sports",
    author: {
      name: "David Osei",
      avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&q=80",
      role: "Sports Editor",
    },
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80",
    publishedAt: "2026-06-20T10:00:00Z",
    readingTime: 8,
    featured: false,
    trending: false,
    tags: ["football", "afcon", "sports", "africa"],
    views: 11300,
  },
  {
    id: "14",
    slug: "inside-the-cyber-heist",
    title: "Inside The Cyber Heist: How Hackers Targeted African Banks",
    excerpt:
      "A sophisticated cybercrime syndicate executed a coordinated attack on financial institutions across three African nations.",
    content: `<p>It began as an ordinary Tuesday morning in Nairobi. But behind the scenes of several of East Africa's largest commercial banks, a digital battle was underway that would ultimately cost the institutions over $47 million.</p>`,
    category: "technology",
    author: {
      name: "Amara Okonkwo",
      avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80",
      role: "Technology Editor",
    },
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
    publishedAt: "2026-06-19T14:00:00Z",
    readingTime: 9,
    featured: false,
    trending: false,
    tags: ["cybersecurity", "technology", "finance"],
    views: 14200,
  },
  {
    id: "15",
    slug: "africa-space-agency-launch",
    title: "Africa's Own Space Agency Is Closer to Reality Than You Think",
    excerpt:
      "The African Space Agency is accelerating its mission to launch Africa's first continental satellite constellation by 2028.",
    content: `<p>When Egypt's EgyptSat-A2 launched from Russia's Baikonur Cosmodrome, it marked another milestone in Africa's growing presence in space. But the continent's ambitions reach far higher.</p>`,
    category: "technology",
    author: {
      name: "Amara Okonkwo",
      avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80",
      role: "Technology Editor",
    },
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    publishedAt: "2026-06-18T11:00:00Z",
    readingTime: 6,
    featured: false,
    trending: false,
    tags: ["space", "technology", "africa"],
    views: 9800,
  },
  {
    id: "16",
    slug: "rwandan-healthcare-model",
    title: "Rwanda's Healthcare Model Is Being Copied Across Africa",
    excerpt:
      "Rwanda's community-based health system has become a global template for affordable, high-quality healthcare delivery.",
    content: `<p>In a continent where healthcare infrastructure often lags behind population growth, Rwanda has emerged as an unlikely global leader. The small East African nation's community health worker programme is now being studied and replicated from South Asia to Latin America.</p>`,
    category: "africa",
    author: {
      name: "Fatima Al-Hassan",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&q=80",
      role: "Africa Correspondent",
    },
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    publishedAt: "2026-06-17T09:00:00Z",
    readingTime: 5,
    featured: false,
    trending: false,
    tags: ["health", "rwanda", "africa"],
    views: 6100,
  },
  {
    id: "17",
    slug: "nairobi-fashion-week-2026",
    title: "Nairobi Fashion Week 2026 Puts African Design on the World Stage",
    excerpt:
      "Africa's premier fashion event showcases designers who are blending traditional craftsmanship with cutting-edge contemporary style.",
    content: `<p>The runway at Nairobi Fashion Week 2026 was not just a showcase of clothing — it was a statement about Africa's place in the global creative economy.</p>`,
    category: "entertainment",
    author: {
      name: "Zara Mensah",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
      role: "Culture Editor",
    },
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    publishedAt: "2026-06-16T13:00:00Z",
    readingTime: 4,
    featured: false,
    trending: false,
    tags: ["fashion", "nairobi", "culture"],
    views: 5400,
  },
  {
    id: "18",
    slug: "ugandan-olympians-2026",
    title: "Uganda's Golden Generation: The Athletes Ready to Conquer the World",
    excerpt:
      "A new cohort of Ugandan athletes across track, field and team sports is poised to make the country proud on the global stage.",
    content: `<p>Uganda has always produced world-class distance runners. But the country's 2026 generation of athletes is breaking moulds — excelling not just in athletics, but in swimming, cycling, basketball and combat sports.</p>`,
    category: "sports",
    author: {
      name: "David Osei",
      avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&q=80",
      role: "Sports Editor",
    },
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80",
    publishedAt: "2026-06-15T10:00:00Z",
    readingTime: 5,
    featured: false,
    trending: false,
    tags: ["uganda", "sports", "athletics"],
    views: 7300,
  },
  {
    id: "19",
    slug: "opinion-africa-25th-century",
    title: "Opinion: Why The 21st Century Will Ultimately Be Africa's Century",
    excerpt:
      "Africa's youth population, resource wealth, and entrepreneurial energy position the continent to lead the second half of this century.",
    content: `<p>Every generation has its moment. Europe dominated the 19th century through industrial might. America led the 20th century through innovation and cultural power. Asia's rise defined the first decades of the 21st century. Now it is Africa's turn.</p>`,
    category: "opinion",
    author: {
      name: "Prof. Nneka Obiora",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80",
      role: "Contributing Editor",
    },
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80",
    publishedAt: "2026-06-14T08:00:00Z",
    readingTime: 8,
    featured: false,
    trending: false,
    tags: ["opinion", "africa", "economy"],
    views: 10900,
  },
  {
    id: "20",
    slug: "kampala-arts-scene-renaissance",
    title: "Kampala's Art Scene Is Experiencing a Cultural Renaissance",
    excerpt:
      "A new wave of galleries, creative collectives and public art installations is transforming Uganda's capital into a continental cultural hub.",
    content: `<p>Walk through Kampala's Nakasero neighbourhood on a Saturday afternoon and you will encounter something remarkable: a city in the throes of a cultural awakening.</p>`,
    category: "uganda",
    author: {
      name: "Moses Okello",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
      role: "Lifestyle Reporter",
    },
    image: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800&q=80",
    publishedAt: "2026-06-13T11:00:00Z",
    readingTime: 5,
    featured: false,
    trending: false,
    tags: ["art", "kampala", "culture"],
    views: 3800,
  },
];

export async function getFeaturedArticle(): Promise<Article> {
  try {
    const result = await db.getFeaturedArticle();
    if (result) return result;
  } catch {}
  return articles.find((a) => a.featured) ?? articles[0];
}

export async function getTrendingArticles(limit = 3): Promise<Article[]> {
  try {
    return await db.getTrendingArticles(limit);
  } catch {
    return articles.filter((a) => a.trending && !a.featured).slice(0, limit);
  }
}

export async function getLatestArticles(limit = 8): Promise<Article[]> {
  try {
    return await db.getLatestArticles(limit);
  } catch {
    return [...articles]
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  }
}

export async function getArticlesByCategory(category: string, limit?: number): Promise<Article[]> {
  try {
    return await db.getArticlesByCategory(category, limit);
  } catch {
    const filtered = articles.filter(
      (a) => a.category.toLowerCase() === category.toLowerCase()
    );
    return limit ? filtered.slice(0, limit) : filtered;
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  try {
    return await db.getArticleBySlug(slug);
  } catch {
    return articles.find((a) => a.slug === slug);
  }
}

export async function getSidebarLatest(limit = 4): Promise<Article[]> {
  try {
    return await db.getSidebarLatest(limit);
  } catch {
    return [...articles]
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  }
}

export async function getWeeklyHighlights(limit = 4): Promise<Article[]> {
  try {
    return await db.getWeeklyHighlights(limit);
  } catch {
    return [...articles].sort((a, b) => (b.views ?? 0) - (a.views ?? 0)).slice(0, limit);
  }
}

export async function getRelatedArticles(article: Article, limit = 3): Promise<Article[]> {
  try {
    return await db.getRelatedArticles(article, limit);
  } catch {
    return articles
      .filter((a) => a.id !== article.id && a.category === article.category)
      .slice(0, limit);
  }
}

export async function searchArticles(query: string): Promise<Article[]> {
  try {
    return await db.searchArticles(query);
  } catch {
    const q = query.toLowerCase();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.tags.some((t) => t.includes(q))
    );
  }
}

export async function getAllArticles(): Promise<Article[]> {
  try {
    return await db.getAllArticles();
  } catch {
    return articles;
  }
}
