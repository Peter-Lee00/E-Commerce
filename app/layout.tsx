import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import ChatBot from "@/components/ChatBot";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "MyStore",
  description: "Buy cool products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-full flex-col bg-white dark:bg-zinc-950 text-black dark:text-white transition-colors duration-300">
        <ThemeProvider>
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <ChatBot />
        </ThemeProvider>
      </body>
    </html>
  );
}
