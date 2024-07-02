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
      <div className="p-4 pb-2 flex justify-end items-center">
        {width && width >= 768 && (
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg text-white bg-cabgen-200 hover:bg-cabgen-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        )}
      </div>

      <SidebarContext.Provider value={{ expanded }}>
        <ul className="flex-1 px-3">{children}</ul>
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
  if (!context) {
    throw new Error("SidebarItem must be used within a Sidebar");
  }
  const { expanded } = context;

  return (
    <CustomLink href={href} disabled={disabled}>
      <li
        className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${disabled ? "hover:bg-cabgen-300 text-white" : "text-white"}
      `}
      >
        {icon}
        <span
          className={`overflow-hidden transition-all ${
            expanded ? "w-52 ml-3" : "w-0"
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

        {!expanded && (
          <div
            className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-cabgen-400 text-white text-base
          invisible opacity-20 -translate-x-3 transition-all text-nowrap
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          `}
          >
            {text}
          </div>
        )}
      </li>
    </CustomLink>
  );
};

export { Sidebar, SidebarItem };
