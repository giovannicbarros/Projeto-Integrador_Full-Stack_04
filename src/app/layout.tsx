import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "sonner";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Projeto Integrador Full-Stack 04",
  description: "Sistema de Controle de Estoque",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={geist.className} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-white text-gray-900 antialiased">
        <header className="border-b border-gray-200">
          <Navbar />
        </header>
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
