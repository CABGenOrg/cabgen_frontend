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
      className={`container[max-width: 100%] flex flex-col items-center justify-center py-3 ${
        gray ? "bg-gray-100" : "bg-white"
      } ${background && "bg-center bg-cover bg-no-repeat"} ${
        classToAdd && classToAdd
      }`}
      style={
        background
          ? {
              backgroundImage: `linear-gradient(rgba(256, 256, 256, 0.3), rgba(256, 256, 256, 0.3)), url(${background})`,
            }
          : {}
      }
    >
      {children}
    </section>
  );
};

export default Section;
