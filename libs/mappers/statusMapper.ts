import { PostStatus } from "../../src/types/misc/postStatus";

const postStatuses: PostStatus[] = [
  { id: "draft", label: "ร่าง" },
  { id: "active", label: "เผยแพร่แล้ว" },
  { id: "hold", label: "พักการใช้งาน" },
  { id: "sold", label: "ขายแล้ว" },
  { id: "closed", label: "ปิดประกาศ" },
];

const getStatusLabelById = (statusId: string): string => {
  return postStatuses.find((status) => status.id === statusId).label;
};

export { postStatuses, getStatusLabelById };
