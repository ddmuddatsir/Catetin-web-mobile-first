import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RootLayoutClient from "./RouteLayoutClient";
import QueryProvider from "./QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Catetin - Expense Tracker",
  description: "Track your expenses easily with Catetin",
  manifest: "/manifest.json",
  themeColor: "#000000",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Catetin",
  },
  icons: {
    icon: "/logoPengeluarin.png",
    apple: "/logoPengeluarin.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Catetin" />
        <link rel="icon" href="/logoPengeluarin.png" />
        <link rel="apple-touch-icon" href="/logoPengeluarin.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 text-gray-800 flex flex-col max-w-md min-h-screen mx-auto shadow-md`}
      >
        <QueryProvider>
          {/* Gunakan komponen Client */}
          <RootLayoutClient>{children}</RootLayoutClient>
        </QueryProvider>
      </body>
    </html>
  );
}
