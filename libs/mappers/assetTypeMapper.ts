import { AssetType } from '../../src/types/misc/assetType';

const assetTypes: AssetType[] = [
  { id: 'condo', label: 'คอนโด' },
  { id: 'townhome', label: 'ทาวน์โฮม' },
  { id: 'house', label: 'บ้านเดี่ยว' },
  { id: 'land', label: 'ที่ดิน' }
  // { id: "commercial", label: "อาคารพาณิชย์" },
];

const getAssetType = (assetType: string): string => {
  return assetTypes.find((a) => a.id === assetType)?.label || '';
};

export { assetTypes, getAssetType };
