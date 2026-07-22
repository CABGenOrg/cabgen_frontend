"use client";

import { ChevronLast, ChevronFirst } from "lucide-react";
import {
  useContext,
  createContext,
  useState,
  ReactNode,
  FC,
  useEffect,
} from "react";
import { usePathname } from "next/navigation";
import CustomLink from "../General/CustomLink";
import useScreenSize from "@/hooks/useScreenSize";

interface SidebarContextProps {
  expanded: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

interface SidebarProps {
  children: ReactNode;
  className?: string;
}

const Sidebar: FC<SidebarProps> = ({ children, className = "" }) => {
  const { width } = useScreenSize();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (width && width < 768) {
      setExpanded(false);
    }
  }, [width]);

  return (
    <aside className={className}>
      <div className="p-4 pb-2 flex justify-end items-center border-b border-cabgen-200/30">
        {width && width >= 768 && (
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg text-white bg-cabgen-200 hover:bg-cabgen-100 transition-colors"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        )}
      </div>

      <SidebarContext.Provider value={{ expanded }}>
        <ul className="flex-1 px-2 py-1">{children}</ul>
      </SidebarContext.Provider>
    </aside>
  );
};

interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  href: string;
  disabled?: boolean;
  alert?: boolean;
}

const SidebarItem: FC<SidebarItemProps> = ({
  icon,
  text,
  href,
  disabled = false,
  alert = false,
}) => {
  const context = useContext(SidebarContext);
  const pathname = usePathname();
  if (!context) {
    throw new Error("SidebarItem must be used within a Sidebar");
  }
  const { expanded } = context;
  const isActive = pathname.endsWith(href);

  return (
    <CustomLink href={href} disabled={disabled}>
      <li
        className={`
          relative flex items-center py-2 px-2 rounded
          transition-colors duration-150 group
          ${
            disabled
              ? "opacity-40 cursor-not-allowed"
              : "cursor-pointer"
          }
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
        <span
          className={`overflow-hidden transition-all ${
            expanded ? "w-44 ml-3" : "w-0"
          }`}
        >
          {text}
        </span>
        {alert && (
          <div
            className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
              expanded ? "" : "top-2"
            }`}
          />
        )}

        {!expanded && !disabled && (
          <div
            className="
              absolute left-full rounded-md px-2.5 py-1.5 ml-4
              bg-cabgen-200 text-white text-sm shadow-lg
              invisible opacity-0 -translate-x-2 transition-all duration-150 text-nowrap z-50
              group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
            "
          >
            {text}
          </div>
        )}
      </li>
    </CustomLink>
  );
};

export { Sidebar, SidebarItem };
