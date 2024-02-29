import React from "react";
import Image from "next/image";

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
    <div className="grid lg:grid-cols-2 sm:grid-cols-1 grid-cols-2 lg:gap-3 gap-2">
      {data.map(({ image, count, description }, idx) => (
        <div
          key={idx}
          className="flex flex-col justify-center items-center bg-slate-400 rounded-xl h-48 w-48 pt-2"
        >
          <Image
            src={image}
            alt={description}
            width={5000}
            height={5000}
            className="h-1/2 w-auto"
          />

          <div className="text-center text-md mt-3 p-1">
            <span>{count} </span>
            <span>{description}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BoxInfo;
