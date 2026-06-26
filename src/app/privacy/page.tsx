import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "KeFeL Media privacy policy — how we collect, use, and protect your personal data.",
};

export default function PrivacyPage() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 md:px-6 py-10">
      <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-2">
        Privacy <span className="text-brand">Policy</span>
      </h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: June 2026</p>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly:</p>
        <ul>
          <li>Name and email address when subscribing to our newsletter</li>
          <li>Contact information when submitting inquiries or tips</li>
          <li>Account information if you register for our platform</li>
        </ul>
        <p>We also automatically collect:</p>
        <ul>
          <li>IP address, browser type, and device information</li>
          <li>Pages viewed, time spent, and referral sources</li>
          <li>Cookies and similar tracking technologies</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>Deliver news content and personalized recommendations</li>
          <li>Send newsletters and updates (with your consent)</li>
          <li>Respond to inquiries and feedback</li>
          <li>Improve our platform and user experience</li>
          <li>Analyze traffic patterns and audience demographics</li>
        </ul>

        <h2>3. Data Sharing</h2>
        <p>
          We do not sell your personal data to third parties. We may share anonymized, aggregate data with partners
          for analytics purposes. We may disclose information if required by law.
        </p>

        <h2>4. Cookies</h2>
        <p>
          KeFeL Media uses cookies for analytics, personalization, and essential platform functions. You can control
          cookie settings through your browser. Disabling cookies may affect platform performance.
        </p>

        <h2>5. Data Security</h2>
        <p>
          We implement industry-standard security measures to protect your data. However, no online transmission is
          completely secure. We encourage you to use strong passwords and keep your account credentials confidential.
        </p>

        <h2>6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you</li>
          <li>Request correction or deletion of your data</li>
          <li>Withdraw consent for data processing</li>
          <li>Opt out of marketing communications at any time</li>
        </ul>

        <h2>7. Third-Party Services</h2>
        <p>
          We may use third-party services for analytics, hosting, and email delivery. These providers have their own
          privacy policies governing data handling.
        </p>

        <h2>8. Children&rsquo;s Privacy</h2>
        <p>
          KeFeL Media is not directed at children under 13. We do not knowingly collect personal information from
          children. If you believe a child has provided us with data, please contact us.
        </p>

        <h2>9. Changes to This Policy</h2>
        <p>
          We may update this policy periodically. Material changes will be notified via our platform or email.
        </p>

        <h2>10. Contact</h2>
        <p>
          For privacy-related inquiries, contact us at{" "}
          <a href="mailto:privacy@kefelmedia.com" className="text-brand hover:underline">privacy@kefelmedia.com</a>.
        </p>
      </div>
    </div>
  );
}
