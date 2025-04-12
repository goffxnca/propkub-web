import { AreaUnit } from "../../src/types/misc/areaUnit";

const areaUnits: AreaUnit[] = [
  { id: "whole", label: "ยกแปลง", ignorePrefix: true },
  { id: "sqm", label: "ตรม." },
  { id: "sqw", label: "ตรว." },
  { id: "ngan", label: "งาน" },
  { id: "rai", label: "ไร่" },
];

const getAreaUnitById = (areaUnit: string): string => {
  return areaUnits.find((a) => a.id === areaUnit)?.label ?? "N/A";
};

const getStandardAreaUnits = (): AreaUnit[] => {
  return areaUnits.filter((a) => a.id !== "whole");
};

const getAllAreaUnits = (): AreaUnit[] => {
  return areaUnits;
};

export { areaUnits, getAreaUnitById, getStandardAreaUnits, getAllAreaUnits };
