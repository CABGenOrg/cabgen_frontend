import React from "react";
import Section from "../General/Section";
import {
  section_btn,
  section_image,
  section_spacing,
  section_text,
} from "@/styles/tailwind_classes";
import OptimizedImage from "../General/OptimizedImage";
import CustomLink from "../General/CustomLink";
import { Locale } from "@/i18n/i18n.config";
import { getTranslateServer } from "@/lib/getTranslateServer";

const NetworkDescription = ({ lang }: { lang: Locale }) => {
  const {
    dictionary: { Network },
  } = getTranslateServer(lang);

  return (
    <Section id="network-description" gray>
      <div className={`${section_spacing}`}>
        <div className="flex justify-center items-center">
          <OptimizedImage
            src={"/Network/logo_rede_dark.png"}
            alt="network dark logo"
            className="object-cover sm:w-5/6 w-auto"
          />
        </div>
        <div className="flex flex-col justify-center items-center">
          <p className={section_text}>{Network.Description.firstParagraph}</p>
        </div>
      </div>
      <div className={`grid sm:grid-cols-2 grid-cols-1 ${section_spacing}`}>
        <div className="flex justify-center items-center">
          <OptimizedImage
            src={"/Network/curso_rede.jpeg"}
            alt="person pipetting into a plate"
            className={`${section_image} rounded-lg`}
          />
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-start">
            <p className={section_text}>
              {Network.Description.secondParagraph}
            </p>
          </div>
        </div>
      </div>
      <div className={`grid sm:grid-cols-2 grid-cols-1 ${section_spacing}`}>
        <div className="flex flex-col justify-center items-center sm:order-first order-last">
          <div className="flex flex-col justify-center items-start">
            <p className={section_text}>
              {Network.Description.thirdParagraphFirstPart} (
              <span className="italic">
                {Network.Description.thirdParagraphSecondPart}
              </span>
              ){Network.Description.thirdParagraphThirdPart}
            </p>
          </div>
          <div className="flex flex-row justify-center items-center gap-10">
            <CustomLink href="/contact">
              <button className={section_btn}>{Network.Description.contactBtn}</button>
            </CustomLink>
            <CustomLink href="/dashboard">
              <button className={section_btn}>{Network.Description.dashboardBtn}</button>
            </CustomLink>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <OptimizedImage
            src={"/Network/capacitacao_rede.jpeg"}
            alt="people in a room"
            className={`${section_image} rounded-lg`}
          />
        </div>
      </div>
    </Section>
  );
};

export default NetworkDescription;
