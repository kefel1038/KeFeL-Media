import type { Metadata } from "next";
import SignInForm from "./SignInForm";

export const metadata: Metadata = {
  title: "Sign In | KeFeL Media",
  description: "Sign in to your KeFeL Media account for personalized news and saved articles.",
};

export default function SignInPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-2 font-headline">
            Welcome Back
          </h1>
          <p className="text-gray-400">
            Sign in to access your saved articles and personalized feed
          </p>
        </div>
        <SignInForm />
        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <a href="/subscribe" className="text-brand hover:underline font-medium">
            Subscribe now
          </a>
        </p>
      </div>
    </div>
  );
}
