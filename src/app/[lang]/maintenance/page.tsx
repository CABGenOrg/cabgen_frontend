import React from "react";
import Section from "@/components/General/Section";
import { form_spacing } from "@/styles/tailwind_classes";
import OptimizedImage from "@/components/General/OptimizedImage";
import { Cog } from "lucide-react";
import { Locale } from "@/i18n/i18n.config";
import { getTranslateServer } from "@/lib/getTranslateServer";

const Maintenance = ({ params: { lang } }: { params: { lang: Locale } }) => {
  const {
    dictionary: { Maintenance },
  } = getTranslateServer(lang);

  return (
    <Section id="maintenance">
      <div className={form_spacing}>
        <div className="flex flex-col items-center justify-center flex-grow text-center my-5 py-10 mx-5">
          <OptimizedImage
            src="/Home/horizontal_signature_cabgen_dark.png"
            alt="Cabgen logo"
            className="xl:w-[35%] lg:w-[40%] md:w-[50%] sm:w-[55%] w-auto mb-16 mt-5 px-5"
          />
          <div className="flex flex-row justify-evenly items-center gap-3 xl:mb-16 mb-10">
            <Cog
              size={48}
              className="animate-spin-slow xl:h-auto xl:w-auto lg:w-11 lg:h-11 md:w-10 md:h-10 w-8 h-8"
            />
            <h2 className="xl:text-4xl lg:text-3xl md:text-2xl text-xl font-semibold">
              {Maintenance.sectionTitle}
            </h2>
          </div>
          <p className="xl:text-2xl lg:text-xl text-base text-left xl:w-[40%] lg:w-[45%] md:w-[55%] sm:w-[60%] mx-3 w-auto">
            {Maintenance.sectionDescription}
          </p>
        </div>
      </div>
    </Section>
  );
};

export default Maintenance;
