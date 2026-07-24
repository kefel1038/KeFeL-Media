"use client";

import { useState } from "react";
import { Check, Zap, Crown, Building2, Loader2, Mail } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Stay informed with essential news",
    icon: Zap,
    features: [
      "5 articles per month",
      "Breaking news alerts",
      "Daily newsletter",
      "Basic search",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Premium",
    price: "$9",
    period: "/month",
    description: "Unlimited access for news enthusiasts",
    icon: Crown,
    features: [
      "Unlimited articles",
      "Ad-free reading experience",
      "AI-powered article summaries",
      "Personalized news feed",
      "Save & organize articles",
      "Offline reading mode",
      "Priority customer support",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "$49",
    period: "/month",
    description: "For newsrooms and organizations",
    icon: Building2,
    features: [
      "Everything in Premium",
      "Team accounts (up to 25)",
      "API access for data integration",
      "Custom news digest",
      "Editorial analytics dashboard",
      "Dedicated account manager",
      "Custom branding options",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function SubscribeContent() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setMessage(data.message || "Successfully subscribed!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage(
        "Network error. Please check your connection and try again."
      );
    }
  };

  return (
    <div className="w-full max-w-screen-lg mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 font-headline">
          Support Independent Journalism
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Your subscription powers fearless, in-depth reporting from across
          Africa and the world. Choose the plan that works for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 md:p-8 flex flex-col ${
                plan.highlighted
                  ? "bg-zinc-900 border-2 border-brand ring-1 ring-brand/20"
                  : "bg-zinc-900/50 border border-zinc-800"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <div
                  className={`inline-flex p-2 rounded-xl mb-4 ${
                    plan.highlighted
                      ? "bg-brand/10 text-brand"
                      : "bg-zinc-800 text-gray-400"
                  }`}
                >
                  <Icon size={20} />
                </div>
                <h2 className="text-xl font-bold text-white mb-1">
                  {plan.name}
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">
                    {plan.price}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-gray-300"
                  >
                    <Check
                      size={16}
                      className="text-brand shrink-0 mt-0.5"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              {plan.highlighted ? (
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status !== "idle") setStatus("idle");
                      }}
                      placeholder="you@example.com"
                      required
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl text-white pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/50 transition-colors placeholder:text-gray-600"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Subscribing...
                      </>
                    ) : (
                      plan.cta
                    )}
                  </button>
                  {status === "success" && (
                    <p className="text-sm text-green-400 text-center">
                      {message}
                    </p>
                  )}
                  {status === "error" && (
                    <p className="text-sm text-red-400 text-center">
                      {message}
                    </p>
                  )}
                </form>
              ) : (
                <a
                  href="/signin"
                  className="block text-center py-3 px-6 rounded-xl font-semibold text-sm transition-colors bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
                >
                  {plan.cta}
                </a>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-16 text-center">
        <h3 className="text-xl font-bold text-white mb-4">
          Frequently Asked Questions
        </h3>
        <div className="max-w-2xl mx-auto text-left space-y-6">
          <FaqItem
            question="Can I cancel anytime?"
            answer="Yes, you can cancel your subscription at any time. Your access continues until the end of your current billing period."
          />
          <FaqItem
            question="Is there a free trial?"
            answer="Premium subscribers get a 14-day free trial. No credit card required to start."
          />
          <FaqItem
            question="Do you offer student discounts?"
            answer="Yes, we offer a 50% discount for verified students. Contact us with your student ID to get started."
          />
        </div>
      </div>
    </div>
  );
}

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
      <h4 className="font-semibold text-white mb-2">{question}</h4>
      <p className="text-sm text-gray-400">{answer}</p>
    </div>
  );
}
