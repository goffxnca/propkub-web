import { AssetType, AssetTypeData } from '../../src/types/misc/assetType';
import { Locale } from '../../src/types/locale';

const assetTypes: AssetTypeData[] = [
  { id: 'condo', labelTH: 'คอนโด', labelEN: 'Condo' },
  { id: 'townhome', labelTH: 'ทาวน์โฮม', labelEN: 'Townhome' },
  { id: 'house', labelTH: 'บ้านเดี่ยว', labelEN: 'House' },
  { id: 'land', labelTH: 'ที่ดิน', labelEN: 'Land' }
  // { id: "commercial", labelTH: "อาคารพาณิชย์", labelEN: "Commercial" },
];

const getAssetTypes = (locale: Locale = 'th'): AssetType[] => {
  return assetTypes.map((at) => ({
    id: at.id,
    label: locale === 'en' ? at.labelEN : at.labelTH
  }));
};

const getAssetTypeLabel = (
  assetTypeId: string,
  locale: Locale = 'th'
): string => {
  const assetType = assetTypes.find((a) => a.id === assetTypeId);
  if (!assetType) return '';
  return locale === 'en' ? assetType.labelEN : assetType.labelTH;
};

export { getAssetTypes, getAssetTypeLabel };
