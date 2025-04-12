export interface Facility {
  id: string;
  label: string;
  forLand?: boolean;
}

export interface FacilitiesObject {
  [key: string]: boolean;
} 