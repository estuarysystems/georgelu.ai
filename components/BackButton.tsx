"use client";

import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();
  return (
    <button
      className="essay-back"
      onClick={() => {
        // Return to the same focus you left when possible.
        if (window.history.length > 1) router.back();
        else router.push("/");
      }}
    >
      esc / back
    </button>
  );
}
