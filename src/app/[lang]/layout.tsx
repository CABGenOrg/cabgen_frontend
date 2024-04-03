import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Menu from "@/components/General/Menu";
import Footer from "@/components/General/Footer";
import StoreProvider from "@/redux/store/StoreProvider";
import { Locale, i18n } from "@/i18n/i18n.config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CABGen",
  description:
    "A Web Application for the Bioinformatic Analysis of Bacterial Genomes",
  icons: {
    icon: "cabgen.ico",
  },
};

export const generateStaticParams = async () => {
  return i18n.locales.map((locale) => ({ lang: locale }));
};

const RootLayout = ({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: Locale };
}>) => {
  return (
    <StoreProvider>
      <html lang={params.lang}>
        <body className={inter.className}>
          <Menu lang={params.lang} />
          <main className="min-h-[calc(100vh-200px)]">{children}</main>
          <Footer />
        </body>
      </html>
    </StoreProvider>
  );
};

export default RootLayout;
