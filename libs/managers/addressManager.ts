import { apiClient } from "../../lib/api/client";
import {
  Province,
  District,
  SubDistrict,
  LocationBreadcrumb,
} from "../../src/types/models/address";

const PROVINCE_CACHE_KEY = "provinces";
const CACHE_VERSION = "1.0";

interface CachedProvinces {
  timestamp: number;
  data: Province[];
  version: string;
}

const fetchProvincesFromAPI = async (): Promise<Province[]> => {
  const response = await apiClient.provinces.getAll();
  return response as unknown as Province[];
};

export const fetchProvincesServerSide = async () => {
  return fetchProvincesFromAPI();
};

export const fetchProvincesClientSide = async (): Promise<Province[]> => {
  const cached = localStorage.getItem(PROVINCE_CACHE_KEY);
  if (cached) {
    try {
      const parsedCache = JSON.parse(cached) as CachedProvinces;
      if (parsedCache.version === CACHE_VERSION) {
        return parsedCache.data;
      }
    } catch (e) {
      console.warn("Failed to parse provinces cache:", e);
    }
  }

  const provinces = await fetchProvincesFromAPI();

  const cacheData: CachedProvinces = {
    timestamp: Date.now(),
    data: provinces,
    version: CACHE_VERSION,
  };
  localStorage.setItem(PROVINCE_CACHE_KEY, JSON.stringify(cacheData));

  return provinces;
};

const getAllProvincesByRegionId = async (
  regionId: string
): Promise<Province[]> => {
  const provinces = await fetchProvincesClientSide();
  return provinces.filter((p) => p.regionId === regionId);
};

const getProvinceById = async (id: string): Promise<Province> => {
  const provinces = await fetchProvincesClientSide();
  const province = provinces.find((p) => p.id === id);
  if (!province) {
    throw new Error(`Province with ID ${id} not found`);
  }
  return province;
};

const fetchDistrictsByProvinceId = async (
  provinceId: string
): Promise<District[]> => {
  const response = await apiClient.districts.getByProvinceId(provinceId);
  return response as unknown as District[];
};

const fetchSubDistrictsByDistrictId = async (
  districtId: string
): Promise<SubDistrict[]> => {
  const response = await apiClient.subDistricts.getByDistrictId(districtId);
  return response as unknown as SubDistrict[];
};

const getDistrictById = async (id: string): Promise<District> => {
  const response = await apiClient.districts.getById(id);
  return response as unknown as District;
};

const getSubdistrictById = async (id: string): Promise<SubDistrict> => {
  const response = await apiClient.subDistricts.getById(id);
  return response as unknown as SubDistrict;
};

const getBreadcrumbs = async (
  locationtId: string,
  locationType: "pv" | "dt" | "sd"
): Promise<LocationBreadcrumb[]> => {
  let breadcrumbs: LocationBreadcrumb[] = [];

  if (locationType === "sd") {
    const subdistrict = await getSubdistrictById(locationtId);
    breadcrumbs.unshift({ ...subdistrict, type: "sd" });

    const district = await getDistrictById(subdistrict.districtId);
    breadcrumbs.unshift({ ...district, type: "dt" });

    const province = await getProvinceById(district.provinceId);
    breadcrumbs.unshift({ ...province, type: "pv" });
  }

  if (locationType === "dt") {
    const district = await getDistrictById(locationtId);
    breadcrumbs.unshift({ ...district, type: "dt" });

    const province = await getProvinceById(district.provinceId);
    breadcrumbs.unshift({ ...province, type: "pv" });
  }

  if (locationType === "pv") {
    const province = await getProvinceById(locationtId);
    breadcrumbs.unshift({ ...province, type: "pv" });
  }

  return breadcrumbs;
};

export {
  getAllProvincesByRegionId,
  fetchDistrictsByProvinceId,
  fetchSubDistrictsByDistrictId,
  getBreadcrumbs,
};
