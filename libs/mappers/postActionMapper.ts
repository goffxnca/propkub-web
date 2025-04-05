import {
  CheckIcon,
  DocumentAddIcon,
  SearchIcon,
  PencilIcon,
  ExclamationIcon,
  LockClosedIcon,
  GlobeAltIcon,
} from "@heroicons/react/solid";

const postActions = [
  {
    id: "CreatePost",
    label: "สร้างประกาศ",
    icon: DocumentAddIcon,
    iconBackground: "green",
  },
  {
    id: "UpdatePost",
    label: "อัพเดทรายละเอียดประกาศ",
    icon: PencilIcon,
    iconBackground: "green",
  },
  {
    id: "ReportPost",
    label: "ประกาศถูกรายงานผิดกฏ",
    icon: ExclamationIcon,
    iconBackground: "yellow",
  },
  {
    id: "FulfillPost",
    label: "ประกาศปิดการขาย",
    icon: CheckIcon,
    iconBackground: "gray",
  },
  {
    id: "ClosePost",
    label: "ปิดประกาศ",
    icon: LockClosedIcon,
    iconBackground: "gray",
  },
];
const getPostActionById = (postActionId) => {
  return postActions.find((p) => p.id === postActionId) || {};
};

export { getPostActionById };
