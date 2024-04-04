"use client";

import React, { useState } from "react";
import CustomLink from "./CustomLink";
import Image from "next/image";
import {
  HomeIcon,
  NetworkIcon,
  DashboardIcon,
  AboutIcon,
  ContactIcon,
  LoginIcon,
} from "@/components/Images/index";
import LanguageSelector from "./LanguageSelector";
import { MenuIcon, XIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDispatch } from "react-redux";
import { updateLanguage } from "@/redux/slices/languageSlice";
import { getTranslateClient } from "@/lib/getTranslateClient";
import { Locale } from "@/i18n/i18n.config";

const Menu = ({ lang }: { lang: Locale }) => {
  const dispatch = useDispatch();
  dispatch(updateLanguage(lang));

  const {
    dictionary: { Menu: Navbar },
  } = getTranslateClient(lang);

  const [menuOpen, setMenuOpen] = useState(false);
  const handleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const items = [
    { name: Navbar.home, link: "/", icon: <HomeIcon /> },
    { name: Navbar.network, link: "/network", icon: <NetworkIcon /> },
    { name: Navbar.dashboard, link: "/dashboard", icon: <DashboardIcon /> },
    { name: Navbar.about, link: "/about", icon: <AboutIcon /> },
    { name: Navbar.contact, link: "/contact", icon: <ContactIcon /> },
    { name: Navbar.login, link: "/login", icon: <LoginIcon /> },
  ];

  return (
    <nav className="sticky top-0 z-50 shadow-md w-full h-24 bg-cabgen-100 text-white p-2">
      <div className="h-full w-full flex flex-row justify-between items-center px-4 2xl:px-16">
        {/* Logo */}
        <CustomLink href="/">
          <Image
            src="/Menu/fiocruz_logo.png"
            alt="FioCruz logo"
            width={5000}
            height={2500}
            className="w-auto h-20 cursor-pointer"
          />
        </CustomLink>
        {/* Menu */}
        <ul className="hidden md:flex md:flex-row md:justify-center md:items-center md:gap-5">
          {items.map(({ link, name, icon }, idx) => (
            <TooltipProvider key={idx}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <li>
                    <CustomLink
                      href={link}
                      lang={lang}
                      className="fill-white hover:fill-cabgen-600"
                    >
                      {icon}
                    </CustomLink>
                  </li>
                </TooltipTrigger>
                <TooltipContent>{name}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
          <LanguageSelector />
        </ul>
        {/* Menu Icon */}
        <div onClick={handleMenu} className="md:hidden cursor-pointer pl-24">
          <MenuIcon className="h-9 w-9" />
        </div>
      </div>
      {/* Hidden Menu */}
      <div
        className={
          menuOpen
            ? "fixed left-0 top-0 h-auto md:hidden w-full bg-cabgen-200 px-10 py-5 ease-in duration-200"
            : "fixed left-0 top-[-1500%] w-screenpx-10 py-5 ease-out duration-200"
        }
      >
        <div className="flex w-full items-center justify-between">
          <CustomLink href="/">
            <Image
              src="/Menu/fiocruz_logo.png"
              alt="FioCruz logo"
              width={5000}
              height={2500}
              className="w-auto h-[75%] cursor-pointer"
            />
          </CustomLink>
          <div onClick={handleMenu} className="cursor-pointer">
            <XIcon className="w-9 h-9 text-cabgen-900" />
          </div>
        </div>
        <div className="flex-col py-3">
          <ul>
            {items.map(({ link, name, icon }, idx) => (
              <CustomLink href={link} key={idx}>
                <li
                  onClick={() => setMenuOpen(false)}
                  className="flex flex-row justify-start items-center gap-2 fill-cabgen-900 text-cabgen-900 hover:text-cabgen-600 hover:fill-cabgen-600 h-16 py-2 cursor-pointer"
                >
                  {icon} {name}
                </li>
              </CustomLink>
            ))}
            <br />
            <LanguageSelector />
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Menu;
