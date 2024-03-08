import React from "react";
import Image from "next/image";

const Map = () => {
  return (
    <div>
      <Image
        src="/Dashboard/microreact_map.png"
        alt="microreact brazil map"
        width={5000}
        height={5000}
        className="w-auto h-auto rounded-xl"
      ></Image>
    </div>
  );
};

export default Map;
