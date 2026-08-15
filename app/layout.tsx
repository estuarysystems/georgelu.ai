import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-prose",
});

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
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
