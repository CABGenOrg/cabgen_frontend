"use client";

import React, { useState } from "react";
import Link from "next/link";
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

const Menu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const handleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const items = [
    { name: "Home", link: "/", icon: <HomeIcon /> },
    { name: "Network", link: "/network", icon: <NetworkIcon /> },
    { name: "Dashboard", link: "/dashboard", icon: <DashboardIcon /> },
    { name: "About", link: "/about", icon: <AboutIcon /> },
    { name: "Contact", link: "/contact", icon: <ContactIcon /> },
    { name: "Login", link: "/login", icon: <LoginIcon /> },
  ];

  return (
    <nav className="sticky w-full h-24 bg-cabgen-400 text-white p-2">
      <div className="h-full w-full flex flex-row justify-between items-center px-4 2xl:px-16">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/fiocruz_logo.png"
            alt="FioCruz logo"
            width={5000}
            height={2500}
            className="w-auto h-20 cursor-pointer"
          />
        </Link>
        {/* Menu */}
        <ul className="hidden md:flex md:flex-row md:justify-center md:items-center md:gap-5">
          {items.map(({ link, name, icon }, idx) => (
            <TooltipProvider key={idx}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={link}>
                    <li className="fill-white hover:fill-cabgen-600">{icon}</li>
                  </Link>
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
            ? "fixed left-0 top-0 h-auto md:hidden w-screen bg-cabgen-200 px-10 py-5 ease-in duration-200"
            : "fixed left-0 top-[-100%] w-screenpx-10 py-5 ease-out duration-200"
        }
      >
        <div className="flex w-full items-center justify-between">
          <Link href="/">
            <Image
              src="/fiocruz_logo.png"
              alt="FioCruz logo"
              width={5000}
              height={2500}
              className="w-auto h-[80%] cursor-pointer"
            />
          </Link>
          <div onClick={handleMenu} className="cursor-pointer">
            <XIcon className="w-9 h-9 text-cabgen-900" />
          </div>
        </div>
        <div className="flex-col py-4">
          <ul>
            {items.map(({ link, name, icon }, idx) => (
              <Link href={link} key={idx}>
                <li
                  onClick={() => setMenuOpen(false)}
                  className="flex flex-row justify-start items-center gap-3 fill-cabgen-900 text-cabgen-900 hover:text-cabgen-600 hover:fill-cabgen-600 h-20 py-4 cursor-pointer"
                >
                  {icon} {name}
                </li>
              </Link>
            ))}
            <LanguageSelector />
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Menu;
