import type { Metadata } from "next";
import { type Locale } from "@/i18n/i18n.config";
import { getTranslateServer } from "@/lib/getTranslateServer";
import React from "react";
import NetworkDescription from "@/components/Network/NetworkDescription";
import NetworkMap from "@/components/Network/NetworkMap";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const { dictionary } = getTranslateServer(lang);
  return { title: `${dictionary.Network.title} | CABGen` };
}

const Network = async ({ params }: { params: Promise<{ lang: Locale }> }) => {
  const { lang } = await params;
  return (
    <>
      <NetworkDescription lang={lang} />
      <NetworkMap lang={lang} />
    </>
  );
};

export default Network;
