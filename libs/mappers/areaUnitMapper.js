const areaUnits = [
  { id: "whole", label: "ยกแปลง", ignorePrefix: true },
  { id: "sqm", label: "ตรม." },
  { id: "sqw", label: "ตรว." },
  { id: "ngan", label: "งาน" },
  { id: "rai", label: "ไร่" },
];
const getAreaUnitById = (areaUnit) => {
  return areaUnits.find((a) => a.id === areaUnit)?.label ?? "N/A";
};

const getStandardAreaUnits = () => {
  return areaUnits.filter((a) => a.id !== "whole");
};

const getAllAreaUnits = () => {
  return areaUnits;
};

export { areaUnits, getAreaUnitById, getStandardAreaUnits, getAllAreaUnits };
