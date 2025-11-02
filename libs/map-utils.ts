const googleMapGeoCodeToAddress = (geoCodeResults = []) => {
  let fullAddress = '';
  geoCodeResults.forEach((addressInfo) => {
    fullAddress = fullAddress + ' ' + addressInfo.long_name || '';
  });
  return fullAddress;
};

export { googleMapGeoCodeToAddress };
