import React from "react";
import Link from "next/link";
import { Locale } from "@/i18n/i18n.config";
import { getTranslateServer } from "@/lib/getTranslateServer";

const WarningBanner = ({ lang }: { lang: Locale }) => {
  const {
    dictionary: { Home },
  } = getTranslateServer(lang);

  return (
    <div className="bg-red-600 text-white text-center py-4 px-4 md:px-8 overflow-hidden">
      <div className="flex items-center gap-5 whitespace-nowrap md:text-lg animate-marquee">
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="flex items-center flex-shrink-0">
            <span className="mr-2">{Home.WarningBanner.title}</span>
            <Link
              href="https://cabgen.fiocruz.br"
              className="flex items-center gap-1 hover:text-yellow-400 transition-colors"
              passHref={true}
              target="_blank"
              aria-label="Acessar novo site"
            >
              <span className="underline">cabgen.fiocruz.br</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WarningBanner;
