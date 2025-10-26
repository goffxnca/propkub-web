import { Address } from '../../src/types/models/address';

const formatAddress = (address: Address): string => {
  const { provinceLabel, districtLabel, subDistrictLabel } = address;
  return `${provinceLabel}, ${districtLabel}, ${subDistrictLabel}`;
};

const formatAddressFull = (address: Address): string => {
  const { provinceId, provinceLabel, districtLabel, subDistrictLabel } =
    address;
  const isBangkok = provinceId === 'p1';
  return `${getSubDistrictPrefix(isBangkok)}${subDistrictLabel} ${getDistrictPrefix(
    isBangkok
  )}${districtLabel}  จังหวัด${provinceLabel}`;
};

const getSubDistrictPrefix = (isBangkok = false): string =>
  isBangkok ? 'แขวง' : 'ตำบล';
const getDistrictPrefix = (isBangkok = false): string =>
  isBangkok ? 'เขต' : 'อำเภอ';

export {
  formatAddress,
  formatAddressFull,
  getDistrictPrefix,
  getSubDistrictPrefix
};
