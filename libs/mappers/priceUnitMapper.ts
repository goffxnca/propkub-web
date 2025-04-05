const timeMatricUnits = [
  { id: "year", label: "ปี" },
  { id: "month", label: "เดือน" },
  { id: "week", label: "สัปดาห์" },
  { id: "day", label: "วัน" },
];

const areaMatricUnits = getAllAreaUnits();

import { getAllAreaUnits } from "./areaUnitMapper";

const pricePerUnitMapping = [
  { assetType: "condo", postType: "sale", units: [] },
  { assetType: "condo", postType: "rent", units: [...timeMatricUnits] },
  { assetType: "townhome", postType: "sale", units: [] },
  { assetType: "townhome", postType: "rent", units: [...timeMatricUnits] },
  { assetType: "house", postType: "sale", units: [] },
  { assetType: "house", postType: "rent", units: [...timeMatricUnits] },
  { assetType: "commercial", postType: "sale", units: [] },
  { assetType: "commercial", postType: "rent", units: [...timeMatricUnits] },
  { assetType: "land", postType: "sale", units: [...areaMatricUnits] },
  { assetType: "land", postType: "rent", units: [...areaMatricUnits] },
];

const getPriceUnit = (priceUnit) => {
  return (
    timeMatricUnits.concat(areaMatricUnits).find((p) => p.id === priceUnit)
      ?.label ?? "N/A"
  );
};

const getPriceUnitList = (assetType, postType) => {
  return (
    pricePerUnitMapping.find(
      (p) => p.assetType === assetType && p.postType === postType
    )?.units || []
  );
};

export { getPriceUnit, getPriceUnitList };
