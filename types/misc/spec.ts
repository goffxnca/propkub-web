export interface Spec {
  id: string;
  label: string;
}

export interface SpecDbFormat {
  id: string;
  value: number;
  label: string;
}

export interface SpecsObject {
  [key: string]: number;
}
