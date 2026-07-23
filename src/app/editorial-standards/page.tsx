import type { Metadata } from "next";
import { Shield, Eye, Users, Scale, BookOpen, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Editorial Standards | KeFeL Media",
  description: "KeFeL Media's commitment to accuracy, fairness, independence, and transparency in journalism.",
};

const principles = [
  {
    icon: Eye,
    title: "Accuracy",
    description: "Every fact is verified through multiple independent sources before publication. We correct errors promptly and transparently.",
  },
  {
    icon: Scale,
    title: "Fairness & Impartiality",
    description: "We present all sides of a story fairly. Our reporting is free from political, commercial, or personal bias.",
  },
  {
    icon: Shield,
    title: "Independence",
    description: "Our editorial decisions are made independently of advertisers, donors, or political interests.",
  },
  {
    icon: Users,
    title: "Accountability",
    description: "We are accountable to our readers. When we make mistakes, we acknowledge and correct them openly.",
  },
  {
    icon: BookOpen,
    title: "Transparency",
    description: "We clearly distinguish between news, opinion, and sponsored content. We disclose conflicts of interest.",
  },
  {
    icon: AlertCircle,
    title: "Minimizing Harm",
    description: "We balance the public's right to know against potential harm. We are especially careful with vulnerable communities.",
  },
];

export default function EditorialStandardsPage() {
  return (
    <div className="w-full max-w-screen-lg mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 font-headline">
          Editorial Standards
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed max-w-3xl">
          At KeFeL Media, we are committed to the highest standards of journalism.
          These principles guide every story we publish and every decision we make.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {principles.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-brand/10 rounded-lg">
                  <Icon size={18} className="text-brand" />
                </div>
                <h2 className="text-lg font-bold text-white">{p.title}</h2>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{p.description}</p>
            </div>
          );
        })}
      </div>

      <div className="prose-dark max-w-3xl space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Sourcing & Verification</h2>
          <div className="space-y-3 text-gray-400 text-sm leading-relaxed">
            <p>We require a minimum of two independent sources for every factual claim. When only one source is available, we clearly label the information and explain why we cannot independently verify it.</p>
            <p>Anonymous sources are used only when the source faces a genuine risk of retaliation, and when the information is of significant public interest. Editorial approval is required before any anonymous sourcing.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Conflicts of Interest</h2>
          <div className="space-y-3 text-gray-400 text-sm leading-relaxed">
            <p>All journalists must disclose any financial, personal, or professional conflicts of interest related to their coverage. Conflicts are reviewed by editors before publication.</p>
            <p>No journalist may own stock in or receive payments from companies they cover. Political activity that could compromise impartiality must be disclosed.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">AI & Technology in Our Newsroom</h2>
          <div className="space-y-3 text-gray-400 text-sm leading-relaxed">
            <p>KeFeL Media uses AI tools to assist with research, translation, and content distribution. AI is never used to generate editorial content without human oversight and verification.</p>
            <p>When AI tools are used in the reporting process, we disclose this to our readers. AI-generated summaries and translations are always reviewed by human editors.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Corrections Policy</h2>
          <div className="space-y-3 text-gray-400 text-sm leading-relaxed">
            <p>We correct errors of fact promptly and transparently. Corrections are appended to the article with a clear note about what was changed and when. Significant corrections are highlighted at the top of the article.</p>
            <p>Readers can report errors through our <a href="/contact" className="text-brand hover:underline">contact page</a> or by emailing corrections@kefelmedia.com.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
