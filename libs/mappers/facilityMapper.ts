import { Facility, FacilityData, FacilitiesObject } from '../../src/types/misc/facility';
import { Locale } from '../../src/types/locale';

const facilitiesData: FacilityData[] = [
  { id: 'ac', labelTH: 'แอร์', labelEN: 'Air Conditioning' },
  { id: 'wardrobe', labelTH: 'ตู้เสื้อผ้า', labelEN: 'Wardrobe' },
  { id: 'sofa', labelTH: 'โซฟา', labelEN: 'Sofa' },
  { id: 'tv', labelTH: 'ทีวี', labelEN: 'TV' },
  { id: 'fridge', labelTH: 'ตู้เย็น', labelEN: 'Refrigerator' },
  { id: 'laundry', labelTH: 'เครื่องซักผ้า', labelEN: 'Washing Machine' },
  { id: 'microwave', labelTH: 'ไมโครเวฟ', labelEN: 'Microwave' },
  { id: 'ddl', labelTH: 'ประตูดิจิตอล', labelEN: 'Digital Door Lock' },
  { id: 'waterheat', labelTH: 'เครื่องทำน้ำอุ่น', labelEN: 'Water Heater' },
  { id: 'eStove', labelTH: 'เตาไฟฟ้า', labelEN: 'Electric Stove' },
  { id: 'hood', labelTH: 'เครื่องดูดควัน', labelEN: 'Range Hood' },
  { id: 'table1', labelTH: 'โต๊ะกินข้าว', labelEN: 'Dining Table' },
  { id: 'table2', labelTH: 'โต๊ะทำงาน', labelEN: 'Work Desk' },
  { id: 'table3', labelTH: 'โต๊ะเครื่องแป้ง', labelEN: 'Vanity Table' },
  { id: 'walkinC', labelTH: 'วอล์คอินโคลเซท', labelEN: 'Walk-in Closet' },
  { id: 'balcony', labelTH: 'ระเบียง', labelEN: 'Balcony' },
  { id: 'cctv', labelTH: 'กล้องวงจรปิด', labelEN: 'CCTV' },
  { id: 'guard', labelTH: 'รปภ.', labelEN: 'Security Guard' },
  { id: 'club', labelTH: 'คลับ/สโมสร', labelEN: 'Clubhouse' },
  { id: 'fitness', labelTH: 'ฟิตเนส', labelEN: 'Fitness Center' },
  { id: 'pool', labelTH: 'สระว่ายน้ำ', labelEN: 'Swimming Pool' },
  { id: 'library', labelTH: 'ห้องสมุด', labelEN: 'Library' },
  { id: 'playground', labelTH: 'สนามเด็กเล่น', labelEN: 'Playground' },
  { id: 'rooftop', labelTH: 'ดาดฟ้า/สกายเล้าจน์', labelEN: 'Rooftop/Sky Lounge' },
  { id: 'van', labelTH: 'รถรับส่งโครงการ', labelEN: 'Shuttle Service' },
  { id: 'lobby', labelTH: 'ล็อบบี้', labelEN: 'Lobby' },
  { id: 'mailbox', labelTH: 'เมลบ๊อกซ์', labelEN: 'Mailbox' },
  { id: 'garden', labelTH: 'สวนหย่อม', labelEN: 'Garden' },
  { id: 'cowork', labelTH: 'โคเวิร์คกิ้งสเปซ', labelEN: 'Co-working Space' },
  { id: 'wifi', labelTH: 'วายฟาย', labelEN: 'WiFi' },

  { id: 'electric', labelTH: 'ไฟฟ้า', labelEN: 'Electricity', forLand: true },
  { id: 'pipedWater', labelTH: 'น้ำประปา', labelEN: 'Tap Water', forLand: true },
  { id: 'groundWater', labelTH: 'น้ำบาดาล', labelEN: 'Groundwater', forLand: true },
  { id: 'signal', labelTH: 'สัญญาณมือถือ', labelEN: 'Mobile Signal', forLand: true },
  { id: 'community', labelTH: 'แหล่งชุมชน', labelEN: 'Near Community', forLand: true },
  { id: 'canal', labelTH: 'ติดคลอง', labelEN: 'Canal Front', forLand: true },
  { id: 'pond', labelTH: 'มีบ่อน้ำ', labelEN: 'Pond', forLand: true },
  { id: 'commercial', labelTH: 'ค้าขายได้', labelEN: 'Commercial Use', forLand: true }
];

const getFacilities = (locale: Locale = 'th'): Facility[] => {
  return facilitiesData.map((f) => ({
    id: f.id,
    label: locale === 'en' ? f.labelEN : f.labelTH,
    forLand: f.forLand
  }));
};

const getFacility = (facilityId: string, locale: Locale = 'th'): string => {
  const facility = facilitiesData.find((f) => f.id === facilityId);
  if (!facility) return '';
  return locale === 'en' ? facility.labelEN : facility.labelTH;
};

// Convert from {ac: true, sofa: false, ...} -> [{id: "tv", label: "ทีวี"}]
const getFacilityArray = (facilitiesObject: FacilitiesObject, locale: Locale = 'th'): Facility[] => {
  const facilityArray: string[] = [];
  for (const [key, value] of Object.entries(facilitiesObject)) {
    if (value) {
      facilityArray.push(key); //Take all facilities key which value is 'true'
    }
  }
  const facilities = getFacilities(locale);
  return facilityArray
    .map((facilityArrayItem) =>
      facilities.find((facility) => facility.id === facilityArrayItem)
    )
    .filter((facility) => facility !== undefined) //If matching not found in master facilities list, drop it
    .map((facility) => ({ id: facility.id, label: facility.label })); //Final shape for API call
};

// Convert from [{id: "tv", label: "ทีวี"}, {id: "sofa", label: "โซฟา"}] -> {tv: true, sofa: true}
const getFacilityObject = (facilityArray: Facility[]): FacilitiesObject => {
  return facilityArray.reduce((a, v) => ({ ...a, [v.id]: true }), {});
};

const getLandFacilities = (locale: Locale = 'th'): Facility[] => {
  return getFacilities(locale).filter((f) => f.forLand);
};

const getNonLandFacilities = (locale: Locale = 'th'): Facility[] => {
  return getFacilities(locale).filter((f) => !f.forLand);
};

export {
  getFacilities,
  getFacility,
  getFacilityArray,
  getFacilityObject,
  getLandFacilities,
  getNonLandFacilities
};
