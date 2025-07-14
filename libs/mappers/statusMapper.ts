import { PostStatus } from "../../src/types/misc/postStatus";

const postStatuses: PostStatus[] = [
  { id: "draft", label: "ร่าง", variant: "gray" },
  { id: "active", label: "เผยแพร่แล้ว", variant: "success" },
  { id: "hold", label: "พักการใช้งาน", variant: "warning" },
  { id: "sold", label: "ขายแล้ว", variant: "info" },
  { id: "closed", label: "ปิดประกาศ", variant: "error" },
];

const getStatusLabelById = (statusId: string): string => {
  return postStatuses.find((status) => status.id === statusId).label;
};

const getStatusVariantById = (statusId: string): string => {
  return (
    postStatuses.find((status) => status.id === statusId)?.variant || "gray"
  );
};

export { postStatuses, getStatusLabelById, getStatusVariantById };
