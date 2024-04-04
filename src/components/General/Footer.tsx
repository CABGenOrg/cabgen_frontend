import React from "react";
import CustomLink from "./CustomLink";
import { section_spacing } from "@/styles/tailwind_classes";

const Footer = () => {
  const links = [
    { name: "FAQ", url: "/faq" },
    { name: "Termos de Uso", url: "/terms-of-use" },
    { name: "Créditos das Imagens", url: "/image-credits" },
  ];

  const address = [
    {
      info: "Residência Oficial, Avenida Brasil, 4635 - Manguinhos, Rio de Janeiro - RJ",
    },
    { info: "CEP: 21041-222" },
  ];

  return (
    <footer className="bg-cabgen-400 text-white">
      <div className={`grid grid-cols-2 ${section_spacing}`}>
        <div className="flex flex-col items-center font-light 2xl:text-2xl sm:text-xl text-base">
          {links.map(({ name, url }, idx) => (
            <CustomLink
              className="hover:text-black pointer-events-none"
              href={url}
              key={idx}
            >
              {name}
            </CustomLink>
          ))}
        </div>
        <div className="flex flex-col items-start font-light 2xl:text-xl text-base">
          {address.map(({ info }, idx) => (
            <div key={idx}>{info}</div>
          ))}
        </div>
      </div>
      <div className="bg-cabgen-300 text-opacity-70 text-gray-600 text-center 2xl:text-xl sm:text-base text-sm px-1.5 py-3">
        Copyright ©2024 All rights reserved | PROCC - FIOCRUZ
      </div>
    </footer>
  );
};

export default Footer;
