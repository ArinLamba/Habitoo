import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import QueryProviders from "@/components/providers/query-provider";

const geistSans = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Habitoo | Smart Habit Tracker",
    template: "%s | Habitoo",
  },
  description:
    "Habitoo is a modern habit tracker for building consistency, tracking streaks, logging measurable progress, and visualizing your daily, weekly, and monthly habits.",

  keywords: [
    "habit tracker",
    "habit tracking app",
    "streak tracker",
    "productivity app",
    "goal tracker",
    "daily habits",
    "measurable habits",
    "Habitoo",
  ],

  authors: [{ name: "Arin Lamba" }],
  creator: "Arin Lamba",

  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },

  openGraph: {
    title: "Habitoo | Smart Habit Tracker",
    description:
      "Build better habits with streaks, measurable progress, beautiful analytics, and a modern habit tracking experience.",
    url: "https://habitoo.vercel.app",
    siteName: "Habitoo",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Habitoo habit tracker dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Habitoo | Smart Habit Tracker",
    description:
      "Track habits, build streaks, log progress, and stay consistent with Habitoo.",
    images: ["/og-image.png"],
  },

  metadataBase: new URL("https://habitoo.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
    lang="en"
    className={`${geistSans.className} antialiased `}
    suppressHydrationWarning
    >
        <body className="bg-gray-100 dark:bg-zinc-950">
          <ClerkProvider>
            <QueryProviders>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <TooltipProvider delayDuration={0} skipDelayDuration={0}>
                  <Toaster position="top-center"/>
                  {children}
                </TooltipProvider>
              </ThemeProvider>
            </QueryProviders>
          </ClerkProvider>
        </body>
      </html>
  );
}
