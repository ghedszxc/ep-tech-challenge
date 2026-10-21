import { Suspense } from "react";
import CalendarSSR from "./CalendarSSR";

export default function CalendarPage() {
  return (
    // use suspense to handle the async component and show a fallback while loading
    <Suspense fallback={<div className="w-full mx-auto p-6">Loading calendar...</div>}>
      <CalendarSSR />
    </Suspense>
  );
}
