import { PostType } from '../../src/types/misc/postType';

const postTypes: PostType[] = [
  { id: "sale", label: "ขาย" },
  { id: "rent", label: "ให้เช่า" },
];

const getPostType = (postTypeId: string): string => {
  return postTypes.find((p) => p.id === postTypeId)?.label ?? "";
};

export { postTypes, getPostType };
