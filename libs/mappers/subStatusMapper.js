const postSubStatuses = [
  { id: "created", label: "สร้างประกาศ" },
  { id: "requested_index", label: "Google ประมวลผล" },
  { id: "indexed", label: "ติด Google" },
  { id: "fulfilled", label: "ปิดการขาย" },
  { id: "expired", label: "หมดอายุ" },
  { id: "closed", label: "ปิดประกาศ" },
];
const getSubStatusLabelById = (subStatusId) => {
  return (
    postSubStatuses.find((subStatus) => subStatus.id === subStatusId)?.label ??
    "N/A"
  );
};

export { postSubStatuses, getSubStatusLabelById };
