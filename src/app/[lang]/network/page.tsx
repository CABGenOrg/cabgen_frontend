import React from "react";
import NetworkDescription from "@/components/Network/NetworkDescription";
import NetworkMap from "@/components/Network/NetworkMap";
import { Locale } from "@/i18n/i18n.config";

const Network = async ({ params }: { params: Promise<{ lang: Locale }> }) => {
  const { lang } = await params;
  return (
    <>
      <NetworkDescription lang={lang}/>
      <NetworkMap lang={lang}/>
    </>
  );
};

export default Network;
