import React from "react";

interface SectionParams {
  id: string;
  children: React.ReactNode;
  gray?: boolean;
  background?: string;
  className?: string;
  animated?: boolean;
}

const Section = ({
  id,
  gray,
  children,
  background,
  className,
  animated,
}: SectionParams) => {
  return (
    <section
      id={id}
      className={`w-full flex flex-col items-center py-6 md:py-10 lg:py-16 ${
        gray ? "bg-muted" : "bg-card"
      } ${background ? "bg-center bg-cover bg-no-repeat" : ""} ${
        animated ? "animate-fade-in-up" : ""
      } ${className ?? ""}`}
      style={
        background
          ? {
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3)), url(${background})`,
            }
          : undefined
      }
    >
      {children}
    </section>
  );
};

export default Section;
