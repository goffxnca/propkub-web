const postStatuses = [
  { id: "active", label: "ใช้งาน" },
  { id: "inactive", label: "ปิดการใช้งาน" },
];
const getStatusLabelById = (statusId) => {
  return postStatuses.find((status) => status.id === statusId)?.label ?? "N/A";
};

export { postStatuses, getStatusLabelById };
