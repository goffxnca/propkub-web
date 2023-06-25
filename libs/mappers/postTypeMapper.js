const postTypes = [
  { id: "sale", label: "ขาย" },
  { id: "rent", label: "ให้เช่า" },
];
const getPostType = (postTypeId) => {
  return postTypes.find((p) => p.id === postTypeId)?.label ?? "";
};

export { postTypes, getPostType };
