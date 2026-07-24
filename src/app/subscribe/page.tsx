import type { Metadata } from "next";
import SubscribeContent from "./SubscribeContent";

export const metadata: Metadata = {
  title: "Subscribe | KeFeL Media",
  description:
    "Choose a KeFeL Media subscription plan. Get unlimited access to quality African journalism.",
};

export default function SubscribePage() {
  return <SubscribeContent />;
}
