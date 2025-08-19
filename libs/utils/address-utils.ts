export const populateAddressLabels = (
  addressFormData: Record<string, any>
): Record<string, any> => {
  const getSelectLabel = (elementId: string): string => {
    const element = document.getElementById(elementId) as HTMLSelectElement;
    return element?.options[element.selectedIndex]?.label || "";
  };

  return {
    ...addressFormData,
    provinceLabel: getSelectLabel("address.provinceId"),
    districtLabel: getSelectLabel("address.districtId"),
    subDistrictLabel: getSelectLabel("address.subDistrictId"),
  };
};

export const getSelectLabel = (elementId: string): string => {
  const element = document.getElementById(elementId) as HTMLSelectElement;
  return element?.options[element.selectedIndex]?.label || "";
};
