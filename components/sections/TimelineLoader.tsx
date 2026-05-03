"use client";

import dynamic from "next/dynamic";

const Timeline = dynamic(
  () => import("@/components/sections/timeline-demo").then((m) => m.TimelineDemo),
  { ssr: false, loading: () => <div className="h-96 w-full animate-pulse bg-white/5 rounded-3xl" /> }
);

export function TimelineLoader() {
  return <Timeline />;
}
