import React from "react";
import NetworkDescription from "@/components/Network/NetworkDescription";
import NetworkMap from "@/components/Network/NetworkMap";
import { Locale } from "@/i18n/i18n.config";

const Network = ({ params: { lang } }: { params: { lang: Locale } }) => {
  return (
    <>
      <NetworkDescription lang={lang}/>
      <NetworkMap lang={lang}/>
    </>
  );
};

export default Network;
