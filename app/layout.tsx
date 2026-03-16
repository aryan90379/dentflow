import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import SessionWrapper from "@/components/SessionWrapper";
// import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DentFlow | Zenthlab",
  description: "Management dashboard for dental clinics to track leads, appointments, and patient data, by Zenthlab.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <SessionWrapper>
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </SessionWrapper>
      </body>
    </html>
  );
}