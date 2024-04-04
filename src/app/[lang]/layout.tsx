import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Menu from "@/components/General/Menu";
import Footer from "@/components/General/Footer";
import StoreProvider from "@/redux/store/StoreProvider";
import { Locale, i18n } from "@/i18n/i18n.config";

const futura = localFont({
  src: [
    {
      path: "../../fonts/Futura_Light_font.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../fonts/Futura_Book_font.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../fonts/Futura_Book_Italic_font.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../fonts/Futura_Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../fonts/Futura_Bold_font.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../fonts/Futura_Bold_Italic_font.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../../fonts/Futura_Extra_Black_font.ttf",
      weight: "800",
      style: "normal",
    },
  ],
});

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
        <body className={futura.className}>
          <Menu lang={params.lang} />
          <main className="min-h-[calc(100vh-200px)] flex flex-col justify-center items-cente m-auto p-auto">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </StoreProvider>
  );
};

export default RootLayout;
