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
import { Province, District, SubDistrict, LocationBreadcrumb } from "../../src/types/models/address";

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

const getAllProvinces = async (): Promise<Province[]> => {
  const q = query(provincesCollectionRef, orderBy("name"));

  const provincesDocs = await getDocs(q);
  const provinces: Province[] = [];
  provincesDocs.forEach((doc) => {
    provinces.push({
      ...doc.data(),
      id: doc.id,
    } as Province);
  });
  return provinces;
};

const getAllProvincesByRegionId = async (regionId: string): Promise<Province[]> => {
  const q = query(
    provincesCollectionRef,
    where("regionId", "==", regionId),
    orderBy("name")
  );

  const provincesDocs = await getDocs(q);
  const provinces: Province[] = [];
  provincesDocs.forEach((doc) => {
    provinces.push({
      ...doc.data(),
      id: doc.id,
    } as Province);
  });
  return provinces;
};

const getAllDistrictsByProvinceId = async (provinceId: string): Promise<District[]> => {
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

const getAllSubDistrictsByDistrictId = async (districtId: string): Promise<SubDistrict[]> => {
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

const getProvinceById = async (id: string): Promise<Province> => {
  const docRef = doc(provincesCollectionRef, id);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
  } as Province;
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

const getBreadcrumbs = async (locationtId: string, locationType: 'pv' | 'dt' | 'sd'): Promise<LocationBreadcrumb[]> => {
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
  getAllProvinces,
  getAllProvincesByRegionId,
  getAllDistrictsByProvinceId,
  getAllSubDistrictsByDistrictId,
  getBreadcrumbs,
};
