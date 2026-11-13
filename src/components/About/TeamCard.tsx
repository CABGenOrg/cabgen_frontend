"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import OptimizedImage from "@/components/General/OptimizedImage";

interface Member {
  name: string;
  role: string;
  photo: string;
  link: string;
  className?: string;
}

const TeamCard = ({ name, role, photo, link, className }: Member) => {
  return (
    <Link
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cabgen-200 ${className ?? ""}`}
      aria-label={`${name} - ${role}`}
    >
      <div className="flex flex-row items-center gap-4 h-full bg-card border border-border shadow-sm rounded-xl p-4 transition-all duration-200 ease-out group-hover:shadow-md group-hover:-translate-y-0.5">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-2xl overflow-hidden bg-muted">
          <OptimizedImage
            src={photo}
            alt={name}
            fill
            sizes="(max-width: 640px) 96px, 112px"
            objectFit="cover"
            loading="eager"
            className="object-top transition-transform duration-200 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col justify-center min-w-0 flex-1">
          <div className="flex items-start gap-2 font-semibold text-lg sm:text-xl 2xl:text-2xl text-foreground group-hover:text-cabgen-200 transition-colors">
            <span className="break-words">{name}</span>
            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-1 text-muted-foreground group-hover:text-cabgen-200 transition-colors" />
          </div>
          <div className="text-sm sm:text-base text-muted-foreground mt-1 break-words">
            {role}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TeamCard;
