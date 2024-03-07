import React from "react";
import Link from "next/link";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface Member {
  name: string;
  role: string;
  photo: string;
  link: string;
}

const TeamCard = ({ name, role, photo, link }: Member) => {
  return (
    <div className="flex lg:flex-row md:flex-col sm:flex-row flex-col justify-start items-center gap-3 bg-slate-100 py-3 px-4 rounded-lg hover:scale-110 hover:bg-slate-200 delay-100 ease-in-out transition">
      <Avatar className="w-4/12 h-auto">
        <AvatarImage src={photo} alt={`${name} photo`} />
      </Avatar>
      <div className="flex flex-col justify-center">
        <Link
          href={link}
          passHref={true}
          target="_blank"
          className="lg:text-start md:text-center text-start"
        >
          <div className="font-semibold sm:text-xl text-lg mb-3 hover:text-black/50">
            {name}
          </div>
        </Link>
        <div className="font-light text-base text-slate-900">{role}</div>
      </div>
    </div>
  );
};

export default TeamCard;
