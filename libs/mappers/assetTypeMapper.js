const assetTypes = [
  { id: "condo", label: "คอนโด" },
  { id: "townhome", label: "ทาวน์โฮม" },
  { id: "house", label: "บ้านเดี่ยว" },
  { id: "land", label: "ที่ดิน" },
  // { id: "commercial", label: "อาคารพาณิชย์" },
];
const getAssetType = (assetType) => {
  return assetTypes.find((a) => a.id === assetType)?.label ?? "N/A";
};

export { assetTypes, getAssetType };
