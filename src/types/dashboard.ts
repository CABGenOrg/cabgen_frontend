export interface JSONData {
  last_update: string;
  data: DashboardData[];
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
