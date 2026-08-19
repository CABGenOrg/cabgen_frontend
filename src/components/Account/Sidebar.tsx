"use client";

import { X } from "lucide-react";
import { ReactNode, FC, useContext, createContext } from "react";
import { usePathname } from "next/navigation";
import CustomLink from "../General/CustomLink";
import { cn } from "@/lib/utils";

interface SidebarContextProps {
  onMobileClose?: () => void;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

interface SidebarProps {
  children: ReactNode;
  className?: string;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const Sidebar: FC<SidebarProps> = ({
  children,
  className = "",
  mobileOpen = false,
  onMobileClose,
}) => {
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-200",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={onMobileClose}
        aria-hidden="true"
      />
      <aside
        className={cn(
          "fixed md:sticky top-24 left-0 bottom-0 md:bottom-auto md:h-auto bg-cabgen-400 z-40 flex flex-col",
          "transition-transform duration-200 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0",
          "w-64 md:w-20",
          className,
        )}
      >
        <div className="p-3 pb-2 flex items-center gap-2 border-b border-cabgen-200/30 md:hidden">
          <button
            onClick={onMobileClose}
            className="p-1.5 rounded-lg text-white bg-cabgen-200 hover:bg-cabgen-100 transition-colors"
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
          <span className="text-white font-semibold text-sm">CABGen</span>
        </div>

        <SidebarContext.Provider value={{ onMobileClose }}>
          <ul className="flex-1 px-2 py-1">{children}</ul>
        </SidebarContext.Provider>
      </aside>
    </>
  );
};

interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  href: string;
  disabled?: boolean;
  alert?: boolean;
  indent?: boolean;
}

const SidebarItem: FC<SidebarItemProps> = ({
  icon,
  text,
  href,
  disabled = false,
  alert = false,
  indent = false,
}) => {
  const pathname = usePathname();
  const ctx = useContext(SidebarContext);
  const isActive = pathname.endsWith(href);

  return (
    <CustomLink href={href} disabled={disabled}>
      <li
        onClick={ctx?.onMobileClose}
        className={`
          relative flex items-center py-2 px-2 rounded
          transition-colors duration-150 group
          ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
          ${indent ? "pl-10" : "md:justify-center"}
          ${
            isActive
              ? "bg-cabgen-200 text-white font-semibold"
              : disabled
                ? "text-white"
                : "text-white hover:bg-cabgen-300/40"
          }
        `}
      >
        <span className="flex items-center justify-center w-8 h-8 shrink-0">
          {icon}
        </span>
        <span className="w-auto min-w-0 flex-1 ml-3 md:hidden">{text}</span>
        {alert && (
          <div className="absolute right-2 top-2 w-2 h-2 rounded bg-indigo-400" />
        )}

        <div
          className="
            hidden md:block
            absolute left-full rounded-md px-2.5 py-1.5 ml-4
            bg-cabgen-200 text-white text-sm shadow-lg
            invisible opacity-0 -translate-x-2 transition-all duration-150 text-nowrap z-50
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          "
        >
          {text}
        </div>
      </li>
    </CustomLink>
  );
};

export { Sidebar, SidebarItem };
