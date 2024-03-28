import React from "react";
import { LucideLoader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex justify-center text-center items-center m-3 text-cabgen-300 animate-spin">
      <LucideLoader2 size={40} />
    </div>
  );
};

export default Loading;
