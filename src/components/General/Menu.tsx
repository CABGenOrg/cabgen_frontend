import React from "react";
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
import LanguageDropdown from "./LanguageDropdown";

const Menu = () => {
  const items = [
    { name: "Home", link: "/", icon: <HomeIcon /> },
    { name: "Network", link: "/network", icon: <NetworkIcon /> },
    { name: "Dashboard", link: "/dashboard", icon: <DashboardIcon /> },
    // { name: "About", link: "/about", icon: <AboutIcon /> },
    { name: "Contact", link: "/contact", icon: <ContactIcon /> },
    { name: "Login", link: "/login", icon: <LoginIcon /> },
  ];

  return (
    <nav className="sticky bg-cabgen-400 text-white p-2">
      <div className="flex flex-row justify-between items-center mx-2">
        <Image
          src="/fiocruz_logo.png"
          alt="FioCruz logo"
          width={5000}
          height={2500}
          className="w-auto h-20"
        />
        <ul className="flex flex-row justify-end gap-3">
          {items.map(({ link, icon }, idx) => (
            <li key={idx}>
              <Link
                href={link}
                className="fill-white hover:fill-cabgen-600 h-20"
              >
                {icon}
              </Link>
            </li>
          ))}
          <LanguageDropdown />
        </ul>
      </div>
    </nav>
  );
};

export default Menu;
