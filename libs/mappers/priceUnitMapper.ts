import { getAllAreaUnits } from "./areaUnitMapper";
import { PriceUnit, PricePerUnitMapping } from "../../src/types/misc/priceUnit";

const timeMatricUnits: PriceUnit[] = [
  { id: "year", label: "ปี" },
  { id: "month", label: "เดือน" },
  { id: "week", label: "สัปดาห์" },
  { id: "day", label: "วัน" },
];

const areaMatricUnits = getAllAreaUnits();

const pricePerUnitMapping: PricePerUnitMapping[] = [
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

const getPriceUnit = (priceUnit: string): string => {
  return timeMatricUnits.concat(areaMatricUnits).find((p) => p.id === priceUnit)
    .label;
};

const getPriceUnitList = (assetType: string, postType: string): PriceUnit[] => {
  return (
    pricePerUnitMapping.find(
      (p) => p.assetType === assetType && p.postType === postType
    )?.units || []
  );
};

export { getPriceUnit, getPriceUnitList };
