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
  AccountIcon,
  LogoutIcon,
} from "@/components/Images/index";
import LanguageSelector from "./LanguageSelector";
import { MenuIcon, XIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getTranslateClient } from "@/lib/getTranslateClient";
import { Locale } from "@/i18n/i18n.config";
import { useAuth } from "@/redux/AuthContext";
import { useLogoutMutation } from "@/redux/services/auth/authService";
import { useRouter } from "next/navigation";

const Menu = ({ lang }: { lang: Locale }) => {
  const {
    dictionary: { Menu: Navbar },
  } = getTranslateClient(lang);

  const [menuOpen, setMenuOpen] = useState(false);
  const handleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const { isAuthenticated } = useAuth();
  const [logout] = useLogoutMutation();
  const router = useRouter();

  const handleLogout = async () => {
    await logout(undefined);
    setMenuOpen(false);
    window.location.href = `/${lang}/login`;
  };

  const items = [
    { name: Navbar.home, link: "/", icon: <HomeIcon /> },
    { name: Navbar.network, link: "/network", icon: <NetworkIcon /> },
    { name: Navbar.dashboard, link: "/dashboard", icon: <DashboardIcon /> },
    { name: Navbar.about, link: "/about", icon: <AboutIcon /> },
    { name: Navbar.contact, link: "/contact", icon: <ContactIcon /> },
  ];

  return (
    <nav className="sticky top-0 z-50 shadow-md w-full h-24 bg-cabgen-400 text-white p-2">
      <div className="h-full w-full flex flex-row justify-between items-center px-4 2xl:px-16">
        {/* Logo */}
        <CustomLink href="/">
          <Image
            src="/Menu/fiocruz_logo.png"
            alt="FioCruz logo"
            width={500}
            height={250}
            className="w-auto lg:h-16 h-14 cursor-pointer"
            priority={true}
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
                      className="fill-white hover:fill-cabgen-300"
                    >
                      {icon}
                    </CustomLink>
                  </li>
                </TooltipTrigger>
                <TooltipContent>{name}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
          {isAuthenticated ? (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <li>
                      <CustomLink
                        href="/account"
                        lang={lang}
                        className="fill-white hover:fill-cabgen-300"
                      >
                        <AccountIcon />
                      </CustomLink>
                    </li>
                  </TooltipTrigger>
                  <TooltipContent>{Navbar.account}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="fill-white hover:fill-cabgen-300 cursor-pointer"
                      >
                        <LogoutIcon />
                      </button>
                    </li>
                  </TooltipTrigger>
                  <TooltipContent>{Navbar.logout}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <li>
                    <CustomLink
                      href="/login"
                      lang={lang}
                      className="fill-white hover:fill-cabgen-300"
                    >
                      <LoginIcon />
                    </CustomLink>
                  </li>
                </TooltipTrigger>
                <TooltipContent>{Navbar.login}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
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
            ? "fixed left-0 top-0 h-auto md:hidden w-full bg-cabgen-400 px-10 py-5 ease-in-out duration-300"
            : "fixed left-0 top-[-1500%] w-screen px-10 py-5 ease-in-out duration-300"
        }
      >
        <div className="flex w-full items-center justify-between">
          <CustomLink href="/">
            <Image
              src="/Menu/fiocruz_logo.png"
              alt="FioCruz logo"
              width={500}
              height={250}
              className="w-auto h-[75%] cursor-pointer"
            />
          </CustomLink>
          <div onClick={handleMenu} className="cursor-pointer">
            <XIcon className="w-9 h-9 text-white" />
          </div>
        </div>
        <div className="flex-col py-3">
          <ul>
            {items.map(({ link, name, icon }, idx) => (
              <CustomLink href={link} key={idx}>
                <li
                  onClick={() => setMenuOpen(false)}
                  className="flex flex-row justify-start items-center gap-2 fill-white text-white hover:text-cabgen-300 hover:fill-cabgen-300 h-12 py-2 cursor-pointer"
                >
                  {icon} {name}
                </li>
              </CustomLink>
            ))}
            {isAuthenticated ? (
              <>
                <CustomLink href="/account">
                  <li
                    onClick={() => setMenuOpen(false)}
                    className="flex flex-row justify-start items-center gap-2 fill-white text-white hover:text-cabgen-300 hover:fill-cabgen-300 h-12 py-2 cursor-pointer"
                  >
                    <AccountIcon /> {Navbar.account}
                  </li>
                </CustomLink>
                <li
                  onClick={handleLogout}
                  className="flex flex-row justify-start items-center gap-2 fill-white text-white hover:text-cabgen-300 hover:fill-cabgen-300 h-12 py-2 cursor-pointer"
                >
                  <LogoutIcon /> {Navbar.logout}
                </li>
              </>
            ) : (
              <CustomLink href="/login">
                <li
                  onClick={() => setMenuOpen(false)}
                  className="flex flex-row justify-start items-center gap-2 fill-white text-white hover:text-cabgen-300 hover:fill-cabgen-300 h-12 py-2 cursor-pointer"
                >
                  <LoginIcon /> {Navbar.login}
                </li>
              </CustomLink>
            )}
            <LanguageSelector />
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Menu;
