interface GeocodeAddressComponent {
  long_name?: string;
  short_name?: string;
  types?: string[];
}

const googleMapGeoCodeToAddress = (
  geoCodeResults: GeocodeAddressComponent[] = []
): string => {
  let fullAddress = '';
  geoCodeResults.forEach((addressInfo) => {
    fullAddress = fullAddress + ' ' + (addressInfo.long_name || '');
  });
  return fullAddress.trim();
};

export { googleMapGeoCodeToAddress };
