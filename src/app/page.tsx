import { Hero } from "@/src/components/Hero";
import { Planner } from "@/src/components/Planner";
import { Inspiration } from "@/src/components/Inspiration";
import { ErrorBoundary } from "@/src/components/ErrorBoundary";

export default function Page() {
  return (
    <ErrorBoundary>
      <Hero />
      <Planner />
      <Inspiration />
    </ErrorBoundary>
  );
}
