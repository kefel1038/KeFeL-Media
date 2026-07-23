import type { Metadata } from "next";
import { CheckCircle, Search, Database, Users, AlertTriangle, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Fact-Checking Methodology | KeFeL Media",
  description: "How KeFeL Media verifies claims, checks sources, and ensures accuracy in our reporting.",
};

const steps = [
  {
    step: 1,
    icon: Search,
    title: "Claim Identification",
    description: "Our fact-checkers identify verifiable claims in public statements, articles, and social media posts. Each claim is evaluated for factual basis.",
  },
  {
    step: 2,
    icon: Database,
    title: "Source Research",
    description: "We consult primary sources: official documents, court records, government data, academic research, and direct interviews with experts.",
  },
  {
    step: 3,
    icon: Users,
    title: "Expert Review",
    description: "Claims are reviewed by subject matter experts who provide independent assessment of accuracy, context, and nuance.",
  },
  {
    step: 4,
    icon: CheckCircle,
    title: "Editorial Review",
    description: "A senior editor reviews all evidence and ratings before publication. Disputed ratings are escalated for further discussion.",
  },
];

const ratings = [
  { rating: "True", color: "bg-green-500", description: "The claim is accurate and supported by evidence." },
  { rating: "Mostly True", color: "bg-green-400", description: "The claim is largely accurate but may lack context or minor details." },
  { rating: "Partially True", color: "bg-yellow-500", description: "The claim contains elements of truth but also significant errors or omissions." },
  { rating: "Mostly False", color: "bg-orange-500", description: "The claim contains some truth but the overall message is misleading." },
  { rating: "False", color: "bg-red-500", description: "The claim is not supported by evidence and is contradicted by facts." },
  { rating: "Unverifiable", color: "bg-gray-500", description: "Insufficient evidence exists to determine the accuracy of the claim." },
];

export default function FactCheckingPage() {
  return (
    <div className="w-full max-w-screen-lg mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 font-headline">
          Fact-Checking Methodology
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed max-w-3xl">
          KeFeL Media is committed to combating misinformation through rigorous, transparent fact-checking.
          Our methodology follows international standards set by the International Fact-Checking Network (IFCN).
        </p>
      </div>

      {/* Process */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Our Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.step} className="relative bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="absolute top-4 right-4 text-4xl font-black text-zinc-800">
                  {s.step}
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-brand/10 rounded-lg">
                    <Icon size={18} className="text-brand" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{s.title}</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{s.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ratings */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Our Ratings</h2>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          {ratings.map((r, i) => (
            <div
              key={r.rating}
              className={`flex items-center gap-4 px-6 py-4 ${
                i < ratings.length - 1 ? "border-b border-zinc-800" : ""
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${r.color} flex-shrink-0`} />
              <div className="flex-1">
                <span className="text-sm font-bold text-white">{r.rating}</span>
                <p className="text-xs text-gray-500 mt-0.5">{r.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Disclosure */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 mb-16">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-bold text-white mb-2">AI-Assisted Fact-Checking</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              KeFeL Media uses AI tools to assist with initial claim detection and source research.
              All AI-assisted findings are reviewed and verified by human fact-checkers before publication.
              AI is never the sole arbiter of a fact-check rating.
            </p>
          </div>
        </div>
      </div>

      {/* Corrections */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Report a Claim</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          If you believe we have rated a claim incorrectly, or if you have evidence we should review,
          please contact our fact-checking team.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center gap-2 text-brand hover:underline font-medium text-sm"
        >
          Contact Fact-Checking Team <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
