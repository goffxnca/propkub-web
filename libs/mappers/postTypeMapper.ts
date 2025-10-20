import { PostType, PostTypeData } from '../../src/types/misc/postType';
import { Locale } from '../../src/types/locale';

const postTypes: PostTypeData[] = [
  { id: 'sale', labelTH: 'ขาย', labelEN: 'Sale' },
  { id: 'rent', labelTH: 'ให้เช่า', labelEN: 'Rent' }
];

const getPostTypes = (locale: Locale = 'th'): PostType[] => {
  return postTypes.map((pt) => ({
    id: pt.id,
    label: locale === 'en' ? pt.labelEN : pt.labelTH
  }));
};

const getPostTypeLabel = (postTypeId: string, locale: Locale = 'th'): string => {
  const postType = postTypes.find((p) => p.id === postTypeId);
  if (!postType) return '';
  return locale === 'en' ? postType.labelEN : postType.labelTH;
};

export { getPostTypes, getPostTypeLabel };
