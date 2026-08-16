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
    "George Lu. Bay Area. I work the intersection of business and engineering through my AI agency, Estuary Systems LLC.",
  metadataBase: new URL("https://georgelu.ai"),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${inter.className}`}>
      <body>{children}</body>
    </html>
  );
}
