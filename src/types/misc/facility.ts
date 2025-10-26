export interface FacilityData {
  id: string;
  labelTH: string;
  labelEN: string;
  forLand?: boolean;
}

export interface Facility {
  id: string;
  label: string;
  forLand?: boolean;
}

export interface FacilitiesObject {
  [key: string]: boolean;
}
