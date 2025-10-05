import { getAllAreaUnits } from './areaUnitMapper';
import { PriceUnit, PricePerUnitMapping } from '../../src/types/misc/priceUnit';

const timeUnits: PriceUnit[] = [
  { id: 'year', label: 'ปี' },
  { id: 'month', label: 'เดือน' },
  { id: 'week', label: 'สัปดาห์' },
  { id: 'day', label: 'วัน' }
];

const areaUnits = getAllAreaUnits();

const pricePerUnitMapping: PricePerUnitMapping[] = [
  { assetType: 'condo', postType: 'sale', units: [] },
  { assetType: 'condo', postType: 'rent', units: [...timeUnits] },
  { assetType: 'townhome', postType: 'sale', units: [] },
  { assetType: 'townhome', postType: 'rent', units: [...timeUnits] },
  { assetType: 'house', postType: 'sale', units: [] },
  { assetType: 'house', postType: 'rent', units: [...timeUnits] },
  { assetType: 'commercial', postType: 'sale', units: [] },
  { assetType: 'commercial', postType: 'rent', units: [...timeUnits] },
  { assetType: 'land', postType: 'sale', units: [...areaUnits] },
  { assetType: 'land', postType: 'rent', units: [...areaUnits] }
];

const getPriceUnit = (
  unitId: string,
  tCommon: (key: string, params?: Record<string, any>) => string
): string => {
  if (!unitId) return '';
  const area = tCommon(`areaUnits.${unitId}`);
  if (area !== `areaUnits.${unitId}`) return area;
  const time = tCommon(`timeUnits.${unitId}`);
  if (time !== `timeUnits.${unitId}`) return time;
  return timeUnits.concat(areaUnits).find((p) => p.id === unitId)?.label || '';
};

const getPriceUnitList = (assetType: string, postType: string): PriceUnit[] => {
  return (
    pricePerUnitMapping.find(
      (p) => p.assetType === assetType && p.postType === postType
    )?.units || []
  );
};

export { getPriceUnit, getPriceUnitList };
