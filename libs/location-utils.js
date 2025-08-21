const getLocationPrefix = (locationType, isBangkok) => {
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
