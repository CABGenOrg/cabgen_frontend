import React, { ReactNode } from "react";
import { Sidebar, SidebarItem } from "@/components/Account/Sidebar";
import {
  User2,
  DnaIcon,
  LucideSearch,
  PanelBottom,
  Settings,
  LockIcon,
  FileQuestion,
} from "lucide-react";

interface SidebarLink {
  linkName: string;
  icon: ReactNode;
  link: string;
  active: boolean;
}

const sidebarLinks: SidebarLink[] = [
  {
    linkName: "Visão Geral",
    link: "/account",
    icon: <PanelBottom size={24} />,
    active: true,
  },
  {
    linkName: "Sequências",
    link: "/account/sequences",
    icon: <DnaIcon size={24} />,
    active: true,
  },
  {
    linkName: "Analisar",
    link: "/account/analysis",
    icon: <LucideSearch size={24} />,
    active: true,
  },
  {
    linkName: "Minha Conta",
    link: "/account/my-account",
    icon: <User2 size={24} />,
    active: true,
  },
  {
    linkName: "Segurança",
    link: "/account/security",
    icon: <LockIcon size={24} />,
    active: true,
  },
  {
    linkName: "Configurações",
    link: "/account/settings",
    icon: <Settings size={24} />,
    active: false,
  },
  {
    linkName: "Tutorial",
    link: "/tutorial",
    icon: <FileQuestion size={24} />,
    active: false,
  },
];

const Account = ({ accountComponent }: { accountComponent: ReactNode }) => {
  return (
    <div className="flex flex-row items-center">
      <Sidebar>
        {sidebarLinks.map(({ linkName, icon, link, active }) => (
          <SidebarItem
            key={linkName}
            icon={icon}
            text={linkName}
            href={link}
            active={active}
          />
        ))}
      </Sidebar>
      <div className="flex justify-center items-center m-auto">
        {accountComponent}
      </div>
    </div>
  );
};

export default Account;
