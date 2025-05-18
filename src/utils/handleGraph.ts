const colors = [
  "#1f77b4",
  "#ff7f0e",
  "#2ca02c",
  "#d62728",
  "#9467bd",
  "#8c564b",
  "#e377c2",
  "#7f7f7f",
  "#bcbd22",
  "#17becf",
  "#aec7e8",
  "#ffbb78",
  "#98df8a",
  "#ff9896",
  "#c5b0d5",
  "#c49c94",
  "#393b79",
  "#637939",
  "#8c6d31",
  "#843c39",
  "#7b4173",
  "#3182bd",
  "#e6550d",
  "#31a354",
  "#756bb1",
  "#d6616b",
  "#ce6dbd",
];

const assignedColors = new Map<string, string>();
const usedColorIndexes = new Set<number>();

// Simple hash function to turn a string into a number
const stringToHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

const hslColorFromHash = (hash: number): string => {
  const hue = hash % 360;
  const saturation = 65 + (hash % 15); // 65–80%
  const lightness = 45 + (hash % 10); // 45–55%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

// Deterministic color assignment based on name
export const getColorForSpecies = (species: string): string => {
  if (assignedColors.has(species)) return assignedColors.get(species)!;

  const hash = stringToHash(species);
  let index = hash % colors.length;

  let attempts = 0;
  while (usedColorIndexes.has(index) && attempts < colors.length) {
    index = (index + 1) % colors.length;
    attempts++;
  }

  let color: string;
  if (attempts < colors.length) {
    color = colors[index];
    usedColorIndexes.add(index);
  } else {
    color = hslColorFromHash(hash);
  }

  assignedColors.set(species, color);
  return color;
};

// Returns the next rounded multiple for the Y-axis (e.g., round 242 to 250)
export const getRoundedMax = (value: number) => {
  const multiple = 25;
  return Math.ceil(value / multiple) * multiple;
};

type Item = Record<string, any>;

interface GroupAndCountParams {
  data: Array<Record<string, any>>;
  groupByKey: string;
  countKeys: string[];
  skipValues?: any[];
  sortByTotal?: boolean;
  limit?: number;
}

export const groupAndCountCategories = ({
  data,
  groupByKey,
  countKeys,
  skipValues = ["Not found", "", null],
  sortByTotal = false,
  limit,
}: GroupAndCountParams) => {
  const grouped: Record<string, Record<string, number>> = {};

  data.forEach((item) => {
    let groupVal = item[groupByKey];

    // Normalize and skip invalid group keys
    if (typeof groupVal === "string") groupVal = groupVal.trim();
    if (groupVal === undefined || skipValues.includes(groupVal)) return;

    if (!grouped[groupVal]) {
      grouped[groupVal] = {};
    }

    countKeys.forEach((key) => {
      let val = item[key];

      // Normalize and skip invalid count values
      if (typeof val === "string") val = val.trim();
      if (val === undefined || skipValues.includes(val)) return;

      if (!grouped[groupVal][val]) {
        grouped[groupVal][val] = 0;
      }

      grouped[groupVal][val] += 1;
    });
  });

  const allValues = Array.from(
    new Set(Object.values(grouped).flatMap((counts) => Object.keys(counts)))
  );

  let result = Object.entries(grouped).map(([group, counts]) => {
    const entry: Record<string, any> = { [groupByKey]: group };
    let total = 0;

    allValues.forEach((val) => {
      const count = counts[val] || 0;
      entry[val] = count;
      total += count;
    });

    if (sortByTotal) {
      entry.total = total;
    }

    return entry;
  });

  if (sortByTotal) {
    result.sort((a, b) => (b.total || 0) - (a.total || 0));
  }

  if (limit !== undefined) {
    result = result.slice(0, limit);
  }

  return result;
};

interface GroupAndCountPresenceParams {
  data: Array<Record<string, any>>;
  groupByKey: string;
  countKeys: string[];
  skipValues?: any[];
  limit?: number;
}

export const groupAndCountPresence = ({
  data,
  groupByKey,
  countKeys,
  skipValues = ["Not found", "", null, "Ausente"],
}: GroupAndCountPresenceParams) => {
  const grouped: Record<string, Record<string, number>> = {};

  data.forEach((item) => {
    let groupVal = item[groupByKey];

    if (typeof groupVal === "string") groupVal = groupVal.trim();
    if (groupVal === undefined || skipValues.includes(groupVal)) return;

    if (!grouped[groupVal]) {
      grouped[groupVal] = Object.fromEntries(countKeys.map((key) => [key, 0]));
    }

    countKeys.forEach((key) => {
      let val = item[key];

      if (typeof val === "string") val = val.trim();
      if (val === undefined || skipValues.includes(val)) return;

      grouped[groupVal][key] += 1;
    });
  });

  return Object.entries(grouped).map(([group, counts]) => ({
    [groupByKey]: group,
    ...counts,
  }));
};
