import { Spec, SpecDbFormat, SpecsObject } from "../../src/types/misc/spec";

const specs: Spec[] = [
  { id: "beds", label: "ห้องนอน" },
  { id: "baths", label: "ห้องน้ำ" },
  { id: "area", label: "ตรว." },
  { id: "parkings", label: "ที่จอดรถ" },
  { id: "kitchens", label: "ห้องครัว" },
  { id: "livings", label: "ห้องรับแขก" },
];

const getSpecLabel = (specId: string): string => {
  return specs.find((a) => a.id === specId)?.label || "";
};

// Convert from {beds: 2} -> [{id: "ิbeds", label: "ห้องนอน", value: 2}]
const getSpecsArray = (specsObject: SpecsObject): SpecDbFormat[] => {
  if (!specsObject) return [];

  const specArray: SpecDbFormat[] = [];
  for (const [key, value] of Object.entries(specsObject)) {
    if (value) {
      const spec = getSpecLabel(key);
      specArray.push({ id: key, value: value, label: spec });
    }
  }

  return specArray;
};

// Convert from [{id: "ิbeds", label: "ห้องนอน", value: 2}] -> {beds: 2}
const getSpecsObject = (specsArray: SpecDbFormat[]): SpecsObject => {
  return specsArray.reduce((a, v) => ({ ...a, [v.id]: v.value }), {});
};

export { specs, getSpecLabel, getSpecsArray, getSpecsObject };
