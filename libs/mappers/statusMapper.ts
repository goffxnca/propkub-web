import { PostStatus } from '../../src/types/misc/postStatus';

const postStatuses: PostStatus[] = [
  { id: "active", label: "ใช้งาน" },
  { id: "inactive", label: "ปิดการใช้งาน" },
];

const getStatusLabelById = (statusId: string): string => {
  return postStatuses.find((status) => status.id === statusId)?.label ?? "N/A";
};

export { postStatuses, getStatusLabelById };
