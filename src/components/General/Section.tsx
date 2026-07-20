import React from "react";

interface SectionParams {
  id: string;
  children: React.ReactNode;
  gray?: boolean;
  background?: string;
  classToAdd?: string;
}

const Section = ({
  id,
  gray,
  children,
  background,
  classToAdd,
}: SectionParams) => {
  return (
    <section
      id={id}
      className={`w-full flex flex-col items-center justify-center py-3 ${
        gray ? "bg-gray-100" : "bg-white"
      } ${background ? "bg-center bg-cover bg-no-repeat" : ""} ${
        classToAdd ?? ""
      }`}
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
