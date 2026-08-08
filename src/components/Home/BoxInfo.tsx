"use client";

import React from "react";
import OptimizedImage from "../General/OptimizedImage";
import Loading from "../General/Loading";
import { getTranslateClient } from "@/lib/getTranslateClient";
import { useLanguage } from "@/redux/LanguageContext";
import { useGetMetricsQuery } from "@/redux/services/metrics/metricsService";

const BoxInfo = () => {
  const { data: metrics, isLoading } = useGetMetricsQuery();

  const lang = useLanguage();
  const {
    dictionary: { Home },
  } = getTranslateClient(lang);

  const data = [
    {
      image: "/Home/dna_freepik.png",
      count: metrics?.total_samples ?? 0,
      sg: Home.BoxInfo.samplesInfoSg,
      pl: Home.BoxInfo.samplesInfoPl,
    },
    {
      image: "/Home/bacteria_freepik.png",
      count: metrics?.total_species ?? 0,
      sg: Home.BoxInfo.speciesInfoSg,
      pl: Home.BoxInfo.speciesInfoPl,
    },
    {
      image: "/Home/mutation_freepik.png",
      count: metrics?.total_resistance_genes ?? 0,
      sg: Home.BoxInfo.genesInfoSg,
      pl: Home.BoxInfo.genesInfoPl,
    },
    {
      image: "/Home/earth_freepik.png",
      count: metrics?.total_countries ?? 0,
      sg: Home.BoxInfo.countriesInfoSg,
      pl: Home.BoxInfo.countriesInfoPl,
    },
  ];

  if (isLoading) return <Loading />;

  return (
    <div className="grid lg:grid-cols-2 sm:grid-cols-1 grid-cols-2 content-around lg:gap-4 gap-2">
      {data.map(({ image, count, sg, pl }, idx) => {
        const description = count === 1 ? sg : pl;
        return (
        <div
          key={idx}
          className="flex flex-col justify-center items-center bg-slate-400 p-2 rounded-xl 2xl:h-64 2xl:w-64 sm:h-48 sm:w-52 h-44 w-36"
        >
          <OptimizedImage
            src={image}
            alt={description}
            className="2xl:h-3/5 sm:h-1/2 h-2/5 object-contain"
          />

          <div className="text-center 2xl:text-xl md:text-lg text-lg mt-2 px-1">
            <span>{count} </span>
            <span>{description}</span>
          </div>
        </div>
        );
      })}
    </div>
  );
};

export default BoxInfo;
