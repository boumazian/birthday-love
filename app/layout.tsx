import type { Metadata } from "next";
import { Geist, Geist_Mono, Dancing_Script, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// A flowing script for the greeting, and an elegant serif for the letter body.
const dancingScript = Dancing_Script({
  variable: "--font-script",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-letter",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "A Little Something For You 💌",
  description: "A secret birthday message, sealed with love.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${dancingScript.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
