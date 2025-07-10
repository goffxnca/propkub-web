export const populateAddressLabels = (addressFormData) => {
  const getSelectLabel = (elementId) => {
    const element = document.getElementById(elementId);
    return element?.item(element.selectedIndex)?.label || "";
  };

  return {
    ...addressFormData,
    provinceLabel: getSelectLabel("address.provinceId"),
    districtLabel: getSelectLabel("address.districtId"),
    subDistrictLabel: getSelectLabel("address.subDistrictId"),
  };
};

export const getSelectLabel = (elementId) => {
  const element = document.getElementById(elementId);
  return element?.item(element.selectedIndex)?.label || "";
};
