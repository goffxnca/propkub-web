import { Facility, FacilitiesObject } from "../../src/types/misc/facility";

const facilities: Facility[] = [
  { id: "ac", label: "แอร์" },
  { id: "wardrobe", label: "ตู้เสื้อผ้า" },
  { id: "sofa", label: "โซฟา" },
  { id: "tv", label: "ทีวี" },
  { id: "fridge", label: "ตู้เย็น" },
  { id: "laundry", label: "เครื่องซักผ้า" },
  { id: "microwave", label: "ไมโครเวฟ" },
  { id: "ddl", label: "ประตูดิจิตอล" },
  { id: "waterheat", label: "เครื่องทำน้ำอู่น" },
  { id: "eStove", label: "เตาไฟฟ้า" },
  { id: "hood", label: "เครื่องดูดควัน" },
  { id: "table1", label: "โต๊ะกินข้าว" },
  { id: "table2", label: "โต๊ะทำงาน" },
  { id: "table3", label: "โต๊ะเครื่องแป้ง" },
  { id: "walkinC", label: "วอล์คอินโคลเซท" },
  { id: "balcony", label: "ระเบียง" },
  { id: "cctv", label: "กล้องวงจรปิด" },
  { id: "guard", label: "รปภ." },
  { id: "club", label: "คลับ/สโมสร" },
  { id: "fitness", label: "ฟิตเนส" },
  { id: "pool", label: "สระว่ายน้ำ" },
  { id: "library", label: "ห้องสมุด" },
  { id: "playground", label: "สนามเด็กเล่น" },
  { id: "rooftop", label: "ดาดฟ้า/สกายเล้าจน์" },
  { id: "van", label: "รถรับส่งโครงการ" },
  { id: "lobby", label: "ล็อบบี้" },
  { id: "mailbox", label: "เมลบ๊อกซ์" },
  { id: "garden", label: "สวนหย่อม" },
  { id: "cowork", label: "โคเวิร์คกิ้งสเปซ" },
  { id: "wifi", label: "วายฟาย" },

  { id: "electric", label: "ไฟฟ้า", forLand: true },
  { id: "pipedWater", label: "น้ำประปา", forLand: true },
  { id: "groundWater", label: "น้ำบาดาล", forLand: true },
  { id: "signal", label: "สัญญาณมือถือ", forLand: true },
  { id: "community", label: "แหล่งชุมชุน", forLand: true },
  { id: "canal", label: "ติดคลอง", forLand: true },
  { id: "pond", label: "มีบ่อน้ำ", forLand: true },
  { id: "commercial", label: "ค้าขายได้", forLand: true },
];

const getFacility = (facilityId: string): string => {
  return facilities.find((f) => f.id === facilityId)?.label ?? "N/A";
};

const getFacilityArray = (facilitiesObject: FacilitiesObject): Facility[] => {
  const facilityArray: string[] = [];
  for (const [key, value] of Object.entries(facilitiesObject)) {
    if (value) {
      facilityArray.push(key);
    }
  }
  return facilityArray
    .map((facilityArrayItem) =>
      facilities.find((facility) => facility.id === facilityArrayItem)
    )
    .filter((facility): facility is Facility => facility !== undefined)
    .map((facility) => ({ id: facility.id, label: facility.label }));
};

const getLandFacilities = (): Facility[] => {
  return facilities.filter((f) => f.forLand);
};

const getNonLandFacilities = (): Facility[] => {
  return facilities.filter((f) => !f.forLand);
};

export {
  getFacility,
  getFacilityArray,
  getLandFacilities,
  getNonLandFacilities,
};
