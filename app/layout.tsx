import type { Metadata, Viewport } from "next";
import { serif, sans } from "./fonts";
import "./globals.css";
import { Analytics } from "@/components/Analytics";

const title = "Cana — Heirloom ceramics for the Christian home";
const description =
  "Scripture carved into the clay — heirloom stoneware for the Christian home. Reserve a piece from the founding batch; ships in 6–8 weeks.";

export const metadata: Metadata = {
  metadataBase: new URL("https://canaceramics.com"),
  title,
  description,
  openGraph: {
    title,
    description:
      "Scripture carved into the clay. Reserve a piece from the founding batch.",
    type: "website",
    siteName: "Cana",
    images: [
      { url: "/og.jpg", width: 1200, height: 630, alt: "Cana — heirloom ceramics for the Christian home" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description:
      "Scripture carved into the clay. Reserve a piece from the founding batch.",
    images: ["/og.jpg"],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
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
      <body className="cana-grain font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-umber focus:px-4 focus:py-2 focus:text-bone"
        >
          Skip to content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
