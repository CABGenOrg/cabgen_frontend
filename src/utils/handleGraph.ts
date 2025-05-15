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
