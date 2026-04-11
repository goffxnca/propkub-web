type LocationType = 'pv' | 'dt' | 'sd';

const getLocationPrefix = (
  locationType: LocationType,
  isBangkok: boolean
): string => {
  const prefix =
    locationType === 'pv'
      ? 'จังหวัด'
      : locationType === 'dt'
        ? isBangkok
          ? 'เขต'
          : 'อำเภอ'
        : locationType === 'sd'
          ? isBangkok
            ? 'แขวง'
            : 'ตำบล'
          : '';
  return prefix;
};

export { getLocationPrefix };
