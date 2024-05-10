import React from "react";
import Section from "../General/Section";
import BoxInfo from "./BoxInfo";
import Link from "next/link";
import {
  section_btn,
  section_spacing,
  section_subtitle,
  section_text,
  section_title,
} from "@/styles/tailwind_classes";
import { Locale } from "@/i18n/i18n.config";
import { getTranslateServer } from "@/lib/getTranslateServer";

const Statistics = ({ lang }: { lang: Locale }) => {
  const {
    dictionary: { Home },
  } = getTranslateServer(lang);

  return (
    <Section id="cagben-statistics">
      <div className={`grid sm:grid-cols-2 grid-cols-1 ${section_spacing}`}>
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-start">
            <h2>
              <span className={section_subtitle}>
                {Home.Statistics.sectionTitle}
              </span>
              <br />
              <span className={`uppercase ${section_title}`}>
                {Home.Statistics.sectionSubtitle}
              </span>
            </h2>
            <p className={section_text}>{Home.Statistics.sectionDescription}</p>
          </div>
          <Link href="/login">
            <button className={section_btn}>{Home.Statistics.loginBtn}</button>
          </Link>
        </div>
        <div className="flex justify-center items-center">
          <BoxInfo />
        </div>
      </div>
    </Section>
  );
};

export default Statistics;
