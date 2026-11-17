import React from "react";
import { ChevronDown } from "lucide-react";
import { section_subtitle, section_title } from "@/styles/tailwind_classes";

export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqSection = {
  heading: string;
  items: FaqItem[];
};

interface FaqAccordionProps {
  title: string;
  subtitle?: string;
  sections: FaqSection[];
}

const FaqAccordion = ({
  title,
  subtitle,
  sections,
}: FaqAccordionProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className={`${section_title} text-center mb-6`}>{title}</h2>
      {subtitle && (
        <p className="text-center text-lg text-muted-foreground mb-10">
          {subtitle}
        </p>
      )}

      <div className="space-y-10">
        {sections.map((section) => (
          <div key={section.heading}>
            <h3 className={`${section_subtitle} uppercase mb-4`}>
              {section.heading}
            </h3>

            <div className="space-y-2">
              {section.items.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-lg border border-border bg-card open:bg-muted/50 transition-colors"
                >
                  <summary className="flex items-center justify-between gap-2 px-4 py-3 text-left cursor-pointer list-none select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cabgen-200 [&::marker]:hidden [&::-webkit-details-marker]:hidden">
                    <span className="flex-1 font-medium text-foreground">
                      {item.question}
                    </span>
                    <ChevronDown
                      size={18}
                      className="text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                    />
                  </summary>
                  <div className="px-4 pb-4 text-base text-muted-foreground whitespace-pre-line leading-6">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqAccordion;
