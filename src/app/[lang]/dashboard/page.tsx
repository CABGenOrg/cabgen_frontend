import type { Metadata } from "next";
import { type Locale } from "@/i18n/i18n.config";
import { getTranslateServer } from "@/lib/getTranslateServer";
import React from "react";
import Section from "@/components/General/Section";
import { section_spacing, section_title } from "@/styles/tailwind_classes";
import MicroreactDashboard from "@/components/Dashboard/MicroreactDashboard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const { dictionary } = getTranslateServer(lang);
  return { title: `${dictionary.Dashboard.sectionTitle} | CABGen` };
}

const Dashboard = async ({ params }: { params: Promise<{ lang: Locale }> }) => {
  const { lang } = await params;
  const {
    dictionary: { Dashboard },
  } = getTranslateServer(lang);

  return (
    <Section id="dashboard">
      <div
        className={`flex flex-col justify-center items-center ${section_spacing}`}
      >
        <h1 className={`${section_title} text-center mt-4 mb-7`}>
          {Dashboard.sectionTitle}
        </h1>
        <MicroreactDashboard />
      </div>
    </Section>
  );
};

export default Dashboard;
