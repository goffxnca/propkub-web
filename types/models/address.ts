export interface Address {
  provinceId: string;
  provinceLabel: string;
  districtLabel: string;
  subDistrictLabel: string;
}

export interface Province {
  id: string;
  name: string;
  regionId: string;
}

export interface District {
  id: string;
  name: string;
  provinceId: string;
}

export interface SubDistrict {
  id: string;
  name: string;
  districtId: string;
}

export interface LocationBreadcrumb {
  id: string;
  name: string;
  type: 'pv' | 'dt' | 'sd';
  provinceId?: string;
  districtId?: string;
}
