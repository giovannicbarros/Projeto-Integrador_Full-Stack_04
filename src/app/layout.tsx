import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
