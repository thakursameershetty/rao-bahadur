import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";
import { FloatingBackButton } from "@/components/ui/FloatingBackButton";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "I Root for Rao Bahadur",
  description: "Enter the Fandom.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cinzel.variable} antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground relative">
        {/* Progressive Blur Effects */}
        <div className="progressive-blur-top">
          <div className="pbt-1"></div>
          <div className="pbt-2"></div>
          <div className="pbt-3"></div>
          <div className="pbt-4"></div>
          <div className="pbt-5"></div>
          <div className="pbt-6"></div>
          <div className="pbt-7"></div>
          <div className="pbt-8"></div>
        </div>
        <div className="progressive-blur-bottom">
          <div className="pbb-1"></div>
          <div className="pbb-2"></div>
          <div className="pbb-3"></div>
          <div className="pbb-4"></div>
          <div className="pbb-5"></div>
          <div className="pbb-6"></div>
          <div className="pbb-7"></div>
          <div className="pbb-8"></div>
        </div>

        <FloatingBackButton />
        <main className="flex-grow flex flex-col relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
