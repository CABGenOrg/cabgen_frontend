import React from "react";
import {
  section_btn,
  section_spacing,
  section_subtitle,
  section_text,
} from "@/styles/tailwind_classes";
import Section from "../General/Section";
import CustomLink from "../General/CustomLink";
import { Locale } from "@/i18n/i18n.config";
import { getTranslateServer } from "@/lib/getTranslateServer";

const AboutContact = ({ lang }: { lang: Locale }) => {
  const {
    dictionary: { About },
  } = getTranslateServer(lang);

  return (
    <Section id="cabgen-contact" gray>
      <div className={`grid md:grid-cols-2 grid-cols-1 ${section_spacing}`}>
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-start">
            <h2 className={`${section_subtitle} font-semibold`}>
              {About.AboutContact.sectionTitle}
            </h2>
            <p className={section_text}>
              {About.AboutContact.sectionDescription}
            </p>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <CustomLink href="/contact">
            <button className={section_btn}>
              {About.AboutContact.contactBtn}
            </button>
          </CustomLink>
        </div>
      </div>
    </Section>
  );
};

export default AboutContact;
