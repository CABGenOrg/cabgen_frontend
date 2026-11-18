import React from "react";
import {
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
}

const TermsContent = ({
  title,
  subtitle,
  sections,
}: TermsContentProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto">
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
      </div>
    </div>
  );
};

export default TermsContent;
