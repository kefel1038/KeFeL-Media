import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with KeFeL Media. Send us a message, report a story tip, or reach our editorial team.",
};

const contactMethods = [
  { label: "General Inquiries", email: "info@kefelmedia.com", icon: "✉" },
  { label: "News Tips", email: "tips@kefelmedia.com", icon: "📰" },
  { label: "Editorial", email: "editor@kefelmedia.com", icon: "✍" },
  { label: "Advertise", email: "advertise@kefelmedia.com", icon: "📢" },
];

export default function ContactPage() {
  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 md:px-6 py-10">
      {/* Hero */}
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
          Get in <span className="text-brand">Touch</span>
        </h1>
        <p className="text-lg text-gray-400 leading-relaxed">
          Have a story tip, feedback, or inquiry? We&rsquo;d love to hear from you.
          Reach out to the KeFeL Media team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          {contactMethods.map((method) => (
            <div
              key={method.label}
              className="bg-zinc-900 rounded-xl border border-zinc-800 p-5"
            >
              <h3 className="font-bold text-white text-sm">{method.label}</h3>
              <a
                href={`mailto:${method.email}`}
                className="text-brand hover:text-brand-dark text-sm transition-colors"
              >
                {method.email}
              </a>
            </div>
          ))}

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
            <h3 className="font-bold text-white text-sm mb-2">Visit Us</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              KeFeL Media Centre<br />
              Kampala, Uganda<br />
              East Africa
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
