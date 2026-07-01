import type { Metadata, Viewport } from "next";
import { serif, sans } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://canaceramics.com"),
  title: "Cana — Heirloom ceramics for the Christian home",
  description:
    "Scripture carved into the clay — heirloom stoneware for the Christian home. Reserve a piece from the founding batch; ships in 6–8 weeks.",
  openGraph: {
    title: "Cana — Heirloom ceramics for the Christian home",
    description:
      "Scripture carved into the clay. Reserve a piece from the founding batch.",
    type: "website",
    siteName: "Cana",
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#F4EDDE",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-umber focus:px-4 focus:py-2 focus:text-bone"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
