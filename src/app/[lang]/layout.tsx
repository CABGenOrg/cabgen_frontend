import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Menu from "@/components/General/Menu";
import Footer from "@/components/General/Footer";
import StoreProvider from "@/redux/store/StoreProvider";
import { i18n, type Locale } from "@/i18n/i18n.config";
import { LanguageProvider } from "@/redux/LanguageContext";
import { AuthProvider } from "@/redux/AuthContext";
import Layout from "@/components/General/Layout";
import { Toaster } from "@/components/ui/toaster";
import { getServerUser } from "@/utils/handleServerUser";

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
    icon: "/images/cabgen.ico",
  },
};

export const generateStaticParams = async () => {
  return i18n.locales.map((locale) => ({ lang: locale }));
};

const RootLayout = async ({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) => {
  const initialUser = await getServerUser();
  const { lang } = (await params) as { lang: Locale };

  return (
    <StoreProvider>
      <AuthProvider initialUser={initialUser}>
        <LanguageProvider lang={lang}>
          <html lang={lang}>
            <body className={futura.className}>
              <Menu lang={lang} />
              <main className="md:min-h-[calc(100vh-200px)] min-h-[calc(100vh-250px)]">
                <Layout>{children}</Layout>
              </main>
              <Footer lang={lang} />
              <Toaster />
            </body>
          </html>
        </LanguageProvider>
      </AuthProvider>
    </StoreProvider>
  );
};

export default RootLayout;
