import { Region, RegionData } from '../../src/types/misc/region';
import { Locale } from '../../types/locale';

const regions: RegionData[] = [
  { id: 'r1', labelTH: 'ภาคเหนือ', labelEN: 'Northern' },
  { id: 'r2', labelTH: 'ภาคกลาง', labelEN: 'Central' },
  { id: 'r3', labelTH: 'ภาคตะวันออกเฉียงเหนือ', labelEN: 'Northeastern' },
  { id: 'r4', labelTH: 'ภาคตะวันตก', labelEN: 'Western' },
  { id: 'r5', labelTH: 'ภาคตะวันออก', labelEN: 'Eastern' },
  { id: 'r6', labelTH: 'ภาคใต้', labelEN: 'Southern' }
];

const getRegions = (locale: Locale = 'th'): Region[] => {
  return regions.map((r) => ({
    id: r.id,
    label: locale === 'en' ? r.labelEN : r.labelTH
  }));
};

const getRegionLabel = (regionId: string, locale: Locale = 'th'): string => {
  const region = regions.find((r) => r.id === regionId);
  if (!region) return '';
  return locale === 'en' ? region.labelEN : region.labelTH;
};

export { getRegions, getRegionLabel };
