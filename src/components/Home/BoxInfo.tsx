import React from "react";
import OptimizedImage from "../General/OptimizedImage";

const BoxInfo = () => {
  const genomes = 100;
  const species = 30;
  const resistanceGenes = 75;
  const countries = 10;

  const data = [
    {
      image: "/Home/dna_freepik.png",
      count: genomes,
      description: "genomas submetidos",
    },
    {
      image: "/Home/bacteria_freepik.png",
      count: species,
      description: "espécies analisadas",
    },
    {
      image: "/Home/mutation_freepik.png",
      count: resistanceGenes,
      description: "genes de resistência detectados",
    },
    {
      image: "/Home/earth_freepik.png",
      count: countries,
      description: "países submissores",
    },
  ];

  return (
    <div className="grid lg:grid-cols-2 sm:grid-cols-1 grid-cols-2 content-around lg:gap-3 gap-2">
      {data.map(({ image, count, description }, idx) => (
        <div
          key={idx}
          className="flex flex-col justify-center items-center bg-slate-400 2xl:p-2 p-1.5 rounded-xl 2xl:h-64 2xl:w-64 sm:h-48 sm:w-52 h-42"
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
      ))}
    </div>
  );
};

export default BoxInfo;
