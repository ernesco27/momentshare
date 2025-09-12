import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Toaster } from "sonner";

import { auth } from "@/auth";

import ThemeProvider from "../context/Theme";

const inter = localFont({
  src: "./fonts/interVF.ttf",
  variable: "--font-inter",
  weight: "100 200 300 400 500 600 700 800 900",
});

export const metadata: Metadata = {
  title: "MomentShare",
  description: "Capture, Share, and Relive Your Memories with MomentShare",
  icons: {
    icon: "/images/Favicon.svg",
  },
};

const layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <head></head>
      <SessionProvider session={session}>
        <body className={`${inter.className} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          <Toaster richColors position="top-right" />
        </body>
      </SessionProvider>
    </html>
  );
};

export default layout;
