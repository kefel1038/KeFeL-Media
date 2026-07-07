import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "KeFeL Media terms of use — guidelines for accessing and using our digital news platform.",
};

export default function TermsPage() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 md:px-6 py-10">
      <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
        Terms of <span className="text-brand">Use</span>
      </h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: June 2026</p>

      <div className="prose prose-zinc prose-invert max-w-none">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using KeFeL Media (<strong>keFelmedia.com</strong>), you agree to be bound by these Terms of Use.
          If you do not agree, please do not use our platform.
        </p>

        <h2>2. Content Usage</h2>
        <p>
          All content published on KeFeL Media — including articles, photographs, videos, graphics, and data — is protected
          by copyright and intellectual property laws. You may not reproduce, distribute, or republish our content without
          prior written permission.
        </p>
        <ul>
          <li><strong>Personal Use:</strong> You may view and share links to our content for personal, non-commercial purposes.</li>
          <li><strong>Fair Use:</strong> Brief excerpts may be used with proper attribution and a link to the original article.</li>
          <li><strong>Commercial Use:</strong> Any commercial use requires a licensing agreement. Contact us for details.</li>
        </ul>

        <h2>3. User Conduct</h2>
        <p>When interacting with KeFeL Media — including comments, submissions, or social media — you agree to:</p>
        <ul>
          <li>Not post false, misleading, or defamatory content</li>
          <li>Not harass, abuse, or threaten other users or staff</li>
          <li>Not attempt to disrupt platform operations</li>
          <li>Not impersonate any person or entity</li>
        </ul>

        <h2>4. User-Generated Content</h2>
        <p>
          By submitting content (comments, letters, tips) to KeFeL Media, you grant us a non-exclusive, royalty-free license
          to publish, edit, and distribute that content. You represent that your submission does not violate any third-party
          rights.
        </p>

        <h2>5. Third-Party Links</h2>
        <p>
          Our platform may contain links to third-party websites. We are not responsible for the content, privacy practices,
          or terms of those sites.
        </p>

        <h2>6. Disclaimer of Warranties</h2>
        <p>
          KeFeL Media provides content &ldquo;as is&rdquo; without any warranties, express or implied. We strive for accuracy
          but do not guarantee that all information is complete, current, or error-free.
        </p>

        <h2>7. Limitation of Liability</h2>
        <p>
          KeFeL Media and its affiliates shall not be liable for any damages arising from your use of or inability to use
          the platform.
        </p>

        <h2>8. Changes to Terms</h2>
        <p>
          We reserve the right to update these terms at any time. Changes will be posted here with an updated date.
          Continued use after changes constitutes acceptance.
        </p>

        <h2>9. Contact</h2>
        <p>
          For questions about these terms, contact us at{" "}
          <a href="mailto:legal@kefelmedia.com" className="text-brand hover:underline">legal@kefelmedia.com</a>.
        </p>
      </div>
    </div>
  );
}
