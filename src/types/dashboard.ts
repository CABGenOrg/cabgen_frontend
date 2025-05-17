import { Locale } from "@/i18n/i18n.config";

export interface JSONData {
  last_update: string;
  data: DashboardData[];
}

export interface DashboardDataProps {
  data: DashboardData[];
  lang: Locale;
}
export interface DashboardData {
  id: number;
  species: string;
  state: string;
  year: number | string;
  mlst: string;
  carbapenemase: string;
  oxa_51_like: string;
  aminoglycosides: string;
  quinolones: string;
  sulfonamides: string;
  polymyxin: string;
  plasmids: string;
  sample: string;
  latitude: number;
  longitude: number;
}

export interface SpeciesData {
  [species: string]: number;
}

export interface MarkerWithHoverProps {
  position: [number, number];
  icon: L.DivIcon;
  data: SpeciesData;
  state: string;
}
