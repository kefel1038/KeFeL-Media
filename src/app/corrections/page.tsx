import type { Metadata } from "next";
import { AlertCircle, Mail, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Corrections Policy | KeFeL Media",
  description: "How KeFeL Media handles corrections, clarifications, and updates to published articles.",
};

export default function CorrectionsPage() {
  return (
    <div className="w-full max-w-screen-lg mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 font-headline">
          Corrections Policy
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed max-w-3xl">
          Accuracy is fundamental to our mission. When we make mistakes, we correct them promptly and transparently.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
          <div className="p-3 bg-brand/10 rounded-xl inline-flex mb-3">
            <Clock size={24} className="text-brand" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Timely Corrections</h3>
          <p className="text-gray-400 text-sm">Errors are corrected as soon as they are identified, typically within 24 hours.</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
          <div className="p-3 bg-brand/10 rounded-xl inline-flex mb-3">
            <AlertCircle size={24} className="text-brand" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Transparent Notes</h3>
          <p className="text-gray-400 text-sm">Every correction includes a note explaining what was changed and when.</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
          <div className="p-3 bg-brand/10 rounded-xl inline-flex mb-3">
            <Mail size={24} className="text-brand" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Open Communication</h3>
          <p className="text-gray-400 text-sm">Readers can report errors directly to our corrections team.</p>
        </div>
      </div>

      <div className="prose-dark max-w-3xl space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Types of Corrections</h2>
          <div className="space-y-4">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
              <h3 className="font-bold text-white mb-2">Factual Errors</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Incorrect names, dates, statistics, or quotes are corrected immediately.
                A correction note is appended to the article specifying the change.
              </p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
              <h3 className="font-bold text-white mb-2">Clarifications</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                When additional context is needed to prevent misunderstanding, we add a clarification
                note without changing the original facts.
              </p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
              <h3 className="font-bold text-white mb-2">Updates</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                When a story develops significantly, we update the article and clearly mark new
                information with timestamps.
              </p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
              <h3 className="font-bold text-white mb-2">Retractions</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                In rare cases where an article is fundamentally flawed, we retract it with a
                prominent notice explaining the reason for retraction.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">How to Report an Error</h2>
          <div className="space-y-3 text-gray-400 text-sm leading-relaxed">
            <p>If you believe we have published incorrect information, please contact us through any of these channels:</p>
            <ul className="list-disc list-inside space-y-2 ms-4">
              <li>Email: <a href="mailto:corrections@kefelmedia.com" className="text-brand hover:underline">corrections@kefelmedia.com</a></li>
              <li>Contact form: <a href="/contact" className="text-brand hover:underline">kefelmedia.com/contact</a></li>
              <li>Social media: DM us on any of our official channels</li>
            </ul>
            <p>Please include the article URL, the specific error, and any supporting evidence. Our editorial team reviews all correction requests within 48 hours.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Correction Format</h2>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm leading-relaxed italic">
              <strong className="text-white">Correction:</strong> An earlier version of this article stated
              that [incorrect information]. This has been corrected to [correct information].
              The article was updated on [date].
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
