import type { Metadata } from "next";
import type { ReactNode } from "react";
import { inter } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "George Lu",
    template: "%s — George Lu",
  },
  description:
    "George Lu. Bay Area. The seam between business and engineering. Estuary Systems, and a claims system for people law firms will not represent.",
  metadataBase: new URL("https://georgelu.ai"),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${inter.className}`}>
      <body>{children}</body>
    </html>
  );
}
