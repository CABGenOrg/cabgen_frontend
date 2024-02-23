import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Menu from "@/components/General/Menu";
import Footer from "@/components/General/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CABGen",
  description:
    "A Web Application for the Bioinformatic Analysis of Bacterial Genomes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Menu />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
