import React from "react";
import CustomLink from "@/components/General/CustomLink";
import {
  section_btn,
  section_spacing,
  section_subtitle,
  section_title,
  section_text,
} from "@/styles/tailwind_classes";

export type TermsSection = {
  heading: string;
  paragraphs?: string[];
  items?: string[];
};

interface TermsContentProps {
  title: string;
  subtitle?: string;
  sections: TermsSection[];
  privacyHint: string;
  privacyLink: string;
}

const TermsContent = ({
  title,
  subtitle,
  sections,
  privacyHint,
  privacyLink,
}: TermsContentProps) => {
  return (
    <div className={`${section_spacing} xl:max-w-3xl`}>
      <h1 className={`${section_title} text-center mb-2`}>{title}</h1>
      {subtitle && (
        <p className="text-center text-muted-foreground mb-10">{subtitle}</p>
      )}

      <div className="space-y-10">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className={`${section_subtitle} mb-3`}>{section.heading}</h2>
            {section.paragraphs?.map((paragraph, idx) => (
              <p key={idx} className={section_text}>
                {paragraph}
              </p>
            ))}
            {section.items && (
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                {section.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <p className={section_text}>{privacyHint}</p>
        <div className="flex justify-center mt-4">
          <CustomLink href="/privacy-policy" className={section_btn}>
            {privacyLink}
          </CustomLink>
        </div>
      </div>
    </div>
  );
};

export default TermsContent;
