import React from "react";
import NetworkDescription from "@/components/Network/NetworkDescription";
import NetworkPurposes from "@/components/Network/NetworkPurposes";
import NetworkMap from "@/components/Network/NetworkMap";

const Network = () => {
  return (
    <>
      <NetworkDescription />
      <NetworkPurposes />
      <NetworkMap />
    </>
  );
};

export default Network;
