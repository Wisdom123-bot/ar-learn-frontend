import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AIChatWidget from "@/components/AIChatWidget";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ar-Learn | School Management & Analytics",
  description: "Intelligent school management platform for Kenyan schools – results, CBC, fees, reports, and predictive analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e3a8a" />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
        </Providers>
        <AIChatWidget />
      </body>
    </html>
  );
}
