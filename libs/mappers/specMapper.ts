import { Spec, SpecDbFormat, SpecsObject } from '../../src/types/misc/spec';

const specs: Spec[] = [
  { id: "beds", label: "ห้องนอน" },
  { id: "baths", label: "ห้องน้ำ" },
  { id: "area", label: "ตรว." },
  { id: "parkings", label: "ที่จอดรถ" },
  { id: "kitchens", label: "ห้องครัว" },
  { id: "livings", label: "ห้องรับแขก" },
];

const getSpecLabel = (specId: string): string => {
  return specs.find((a) => a.id === specId)?.label ?? "N/A";
};

const convertSpecToDbFormat = (specsObject: SpecsObject): SpecDbFormat[] => {
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

export { specs, getSpecLabel, convertSpecToDbFormat };
