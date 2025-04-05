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

const provincesCollectionRef = collection(db, "provinces");
const districtsCollectionRef = collection(db, "districts");
const subDistrictsCollectionRef = collection(db, "subDistricts");

// UNCOMMENT THIS LATER FOR INITIAL SEEDING
// import provinces from "../../data/provinces.json";
// import districts from "../../data/districts.json";
// import subDistricts from "../../data/subDistricts.json";

const provinces = [];
const districts = [];
const subDistricts = [];

const seedProvinces = async () => {
  return;
  provinces.forEach(async (province) => {
    const result = await setDoc(doc(provincesCollectionRef, province.id), {
      name: province.name,
      regionId: province.regionId,
    });
    console.log(result);
  });
};

const seedDistricts = async () => {
  return;
  districts.forEach(async (district) => {
    const result = await setDoc(doc(districtsCollectionRef, district.id), {
      name: district.name,
      provinceId: district.provinceId,
    });
    console.log(result);
  });
};

const seedSubDistricts = async () => {
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

const getAllProvinces = async () => {
  const q = query(provincesCollectionRef, orderBy("name"));

  const provincesDocs = await getDocs(q);
  const provinces = [];
  provincesDocs.forEach((doc) => {
    provinces.push({
      ...doc.data(),
      id: doc.id,
    });
  });
  return provinces;
};

const getAllProvincesByRegionId = async (regionId) => {
  const q = query(
    provincesCollectionRef,
    where("regionId", "==", regionId),
    orderBy("name")
  );

  const provincesDocs = await getDocs(q);
  const provinces = [];
  provincesDocs.forEach((doc) => {
    provinces.push({
      ...doc.data(),
      id: doc.id,
    });
  });
  return provinces;
};

const getAllDistrictsByProvinceId = async (provinceId) => {
  const q = query(
    districtsCollectionRef,
    where("provinceId", "==", provinceId),
    orderBy("name")
  );

  const districtsDocs = await getDocs(q);
  const districts = [];
  districtsDocs.forEach((doc) => {
    districts.push({
      ...doc.data(),
      id: doc.id,
    });
  });
  return districts;
};

const getAllSubDistrictsByDistrictId = async (districtId) => {
  const q = query(
    subDistrictsCollectionRef,
    where("districtId", "==", districtId),
    orderBy("name")
  );

  const subDistrictsDocs = await getDocs(q);
  const subDistricts = [];
  subDistrictsDocs.forEach((doc) => {
    subDistricts.push({
      ...doc.data(),
      id: doc.id,
    });
  });
  return subDistricts;
};

const getProvinceById = async (id) => {
  const docRef = doc(provincesCollectionRef, id);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
  };
};

const getDistrictById = async (id) => {
  const docRef = doc(districtsCollectionRef, id);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
  };
};

const getSubdistrictById = async (id) => {
  const docRef = doc(subDistrictsCollectionRef, id);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
  };
};

const getBreadcrumbs = async (locationtId, locationType) => {
  let breadcrumbs = [];

  if (locationType === "sd") {
    debugger;
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
