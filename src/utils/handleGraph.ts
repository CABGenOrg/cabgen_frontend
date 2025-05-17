import L from "leaflet";
import { SpeciesData } from "@/types/dashboard";

const colors = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f50",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
  "#d98880",
  "#c94c4c",
  "#5DADE2",
  "#AF7AC5",
  "#45B39D",
];

// Simple hash function to turn a string into a number
const stringToHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

// Deterministic color assignment based on species name
export const getColorForSpecies = (species: string): string => {
  const hash = stringToHash(species);
  return colors[hash % colors.length];
};

// Returns the next rounded multiple for the Y-axis (e.g., round 242 to 250)
export const getRoundedMax = (value: number) => {
  const multiple = 25;
  return Math.ceil(value / multiple) * multiple;
};

export const PieChartIcon = ({ data }: { data: SpeciesData }) => {
  const total = Object.values(data).reduce((sum, count) => sum + count, 0);
  const speciesCount = Object.keys(data).length;
  let startAngle = 0;
  const radius = 15 + Math.sqrt(total) * 1.5;

  if (speciesCount === 1) {
    const species = Object.keys(data)[0];
    const fill = getColorForSpecies(species);

    const svgString = `
      <svg width="${radius * 2}" height="${radius * 2}" viewBox="0 0 ${
      radius * 2
    } ${radius * 2}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${radius}" cy="${radius}" r="${radius}" fill="${fill}" stroke="#fff" stroke-width="0.5" />
      </svg>
    `;

    return L.divIcon({
      html: svgString,
      className: "pie-chart-icon",
      iconSize: [radius * 2, radius * 2],
      iconAnchor: [radius, radius],
    });
  }

  // Sort the species by quantity
  const sortedEntries = Object.entries(data).sort((a, b) => b[1] - a[1]);

  const svgString = `
    <svg width="${radius * 2}" height="${radius * 2}" viewBox="0 0 ${
    radius * 2
  } ${radius * 2}" xmlns="http://www.w3.org/2000/svg">
      ${sortedEntries
        .map(([species, count]) => {
          const angle = (count / total) * 360;
          const endAngle = startAngle + angle;

          const x1 = radius + radius * Math.cos((Math.PI / 180) * startAngle);
          const y1 = radius + radius * Math.sin((Math.PI / 180) * startAngle);
          const x2 = radius + radius * Math.cos((Math.PI / 180) * endAngle);
          const y2 = radius + radius * Math.sin((Math.PI / 180) * endAngle);

          const largeArcFlag = angle > 180 ? 1 : 0;

          const pathData = [
            `M ${radius} ${radius}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            "Z",
          ].join(" ");

          const fill = getColorForSpecies(species);
          startAngle = endAngle;

          return `<path d="${pathData}" fill="${fill}" stroke="#fff" stroke-width="0.5" />`;
        })
        .join("")}
    </svg>
  `;

  return L.divIcon({
    html: svgString,
    className: "pie-chart-icon",
    iconSize: [radius * 2, radius * 2],
    iconAnchor: [radius, radius],
  });
};
