"use client";

import { useEffect, useState } from "react";

export default function LiveClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  if (!time) {
    return <div className="text-xs text-zinc-400 w-32 hidden md:block">...</div>;
  }

  return (
    <div className="text-xs text-zinc-400 hidden md:block font-mono tracking-wider">
      {time.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
      })}
    </div>
  );
}
