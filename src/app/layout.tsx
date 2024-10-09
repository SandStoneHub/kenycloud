import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ConvexClientProvider from "./ConvexClientProvider";
import { Header } from "./landing/header";
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KenyCloud",
  description: "Open Source file storage",
  icons: {
    icon: 'https://combative-moose-852.convex.site/getImage?storageId=kg20764hbyp6eaj2080rvawzpn72bb50',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <ConvexClientProvider>
          <Toaster />
          <div className="main-header"><Header /></div>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}