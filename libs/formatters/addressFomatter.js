const formatAddress = (address) => {
  const { provinceLabel, districtLabel, subDistrictLabel } = address;
  return `${provinceLabel}, ${districtLabel}, ${subDistrictLabel}`;
};

const formatAddressFull = (address) => {
  const { provinceId, provinceLabel, districtLabel, subDistrictLabel } =
    address;
  const isBangkok = provinceId === "p1";
  return `${getSubDistrictPrefix(
    isBangkok
  )}${subDistrictLabel} ${getDistrictPrefix(
    isBangkok
  )}${districtLabel}  จังหวัด${provinceLabel}`;
};

const getSubDistrictPrefix = (isBangkok = false) =>
  isBangkok ? "แขวง" : "ตำบล";
const getDistrictPrefix = (isBangkok = false) => (isBangkok ? "เขต" : "อำเภอ");

export {
  formatAddress,
  formatAddressFull,
  getDistrictPrefix,
  getSubDistrictPrefix,
};
