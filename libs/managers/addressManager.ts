import {
  collection,
  setDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  updateDoc,
  addDoc,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
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

const provincesCollectionRef = collection(db, "provinces");
const districtsCollectionRef = collection(db, "districts");
const subDistrictsCollectionRef = collection(db, "subDistricts");

// UNCOMMENT THIS LATER FOR INITIAL SEEDING
// import provinces from "../../data/provinces.json";
// import districts from "../../data/districts.json";
// import subDistricts from "../../data/subDistricts.json";

const provinces: Province[] = [];
const districts: District[] = [];
const subDistricts: SubDistrict[] = [];

const seedProvinces = async (): Promise<void> => {
  return;
  provinces.forEach(async (province) => {
    const result = await setDoc(doc(provincesCollectionRef, province.id), {
      name: province.name,
      regionId: province.regionId,
    });
    console.log(result);
  });
};

const seedDistricts = async (): Promise<void> => {
  return;
  districts.forEach(async (district) => {
    const result = await setDoc(doc(districtsCollectionRef, district.id), {
      name: district.name,
      provinceId: district.provinceId,
    });
    console.log(result);
  });
};

const seedSubDistricts = async (): Promise<void> => {
  return;
  subDistricts.forEach(async (subDistrict) => {
    const result = await setDoc(
      doc(subDistrictsCollectionRef, subDistrict.id),
      {
        name: subDistrict.name,
        districtId: subDistrict.districtId,
      }
    );
    console.log(result);
  });
};

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

const getAllDistrictsByProvinceId = async (
  provinceId: string
): Promise<District[]> => {
  const q = query(
    districtsCollectionRef,
    where("provinceId", "==", provinceId),
    orderBy("name")
  );

  const districtsDocs = await getDocs(q);
  const districts: District[] = [];
  districtsDocs.forEach((doc) => {
    districts.push({
      ...doc.data(),
      id: doc.id,
    } as District);
  });
  return districts;
};

const getAllSubDistrictsByDistrictId = async (
  districtId: string
): Promise<SubDistrict[]> => {
  const q = query(
    subDistrictsCollectionRef,
    where("districtId", "==", districtId),
    orderBy("name")
  );

  const subDistrictsDocs = await getDocs(q);
  const subDistricts: SubDistrict[] = [];
  subDistrictsDocs.forEach((doc) => {
    subDistricts.push({
      ...doc.data(),
      id: doc.id,
    } as SubDistrict);
  });
  return subDistricts;
};

const getDistrictById = async (id: string): Promise<District> => {
  const docRef = doc(districtsCollectionRef, id);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
  } as District;
};

const getSubdistrictById = async (id: string): Promise<SubDistrict> => {
  const docRef = doc(subDistrictsCollectionRef, id);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
  } as SubDistrict;
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
  // seedProvinces,
  // seedDistricts,
  // seedSubDistricts,
  getAllProvincesByRegionId,
  getAllDistrictsByProvinceId,
  getAllSubDistrictsByDistrictId,
  getBreadcrumbs,
};
