import { PostSubStatus } from '../../src/types/misc/postSubStatus';

const postSubStatuses: PostSubStatus[] = [
  { id: "created", label: "สร้างประกาศ" },
  { id: "fulfilled", label: "ปิดการขาย" },
  { id: "expired", label: "หมดอายุ" },
  { id: "closed", label: "ปิดประกาศ" },
];

const getSubStatusLabelById = (subStatusId: string): string => {
  return postSubStatuses.find((subStatus) => subStatus.id === subStatusId)?.label ?? "N/A";
};

export { postSubStatuses, getSubStatusLabelById };
