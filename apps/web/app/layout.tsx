import { ClerkProvider } from "@clerk/nextjs";
import { type Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Providers } from "@/components/providers";
import "@workspace/ui/globals.css";
import { Toaster } from "@workspace/ui/components/sonner";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Loco",
  description: "Your AI customer service platform",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased relative`}
          suppressHydrationWarning
        >
          <div
            className="fixed inset-0 opacity-5 -z-30 pointer-events-none"
            style={{
              backgroundImage: "url(/grain.jpg)",
            }}
          />
          <Toaster />
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
