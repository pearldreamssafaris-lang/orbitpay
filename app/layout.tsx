import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Global Payments | Cross-border payment operations",
  description: "A cross-border payments platform foundation."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
