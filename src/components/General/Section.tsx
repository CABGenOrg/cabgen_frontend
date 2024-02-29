import React from "react";

interface SectionParams {
  id: string;
  children: React.ReactNode;
  gray?: boolean;
}

const Section = ({ id, gray, children }: SectionParams) => {
  return (
    <section
      id={id}
      className={`container[max-width: 100%] w-screen flex flex-col items-center justify-center ${
        gray ? "bg-gray-100" : "bg-white"
      }`}
    >
      {children}
    </section>
  );
};

export default Section;
