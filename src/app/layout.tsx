import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloatingButton from "@/components/layout/WhatsAppFloatingButton";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mensageiros da Esperança | Impacto e Transformação Social",
  description: "Organização da Sociedade Civil dedicada à capacitação profissional, inclusão digital, oficinas socioeducativas e apoio a famílias em vulnerabilidade.",
  keywords: ["OSC", "ONG", "Mensageiros da Esperança", "Voluntariado", "Doação", "São Paulo", "Impacto Social", "Inclusão Digital"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable}`}>
      <body className="flex flex-col min-h-screen bg-neutral-bg text-neutral-text font-sans antialiased">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}
