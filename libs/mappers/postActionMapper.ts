import {
  DocumentAddIcon,
  PencilIcon,
  ExclamationIcon,
  CurrencyDollarIcon,
  XIcon,
  GlobeAltIcon,
} from "@heroicons/react/solid";
import { Variant } from "../utils/style-utils";

export interface PostAction {
  id: string;
  label: string;
  variant: Variant;
  icon: React.ComponentType<any>;
}

const postActions: PostAction[] = [
  {
    id: "draft",
    label: "ร่างประกาศ",
    variant: "gray",
    icon: DocumentAddIcon,
  },
  {
    id: "publish",
    label: "เผยแพร่ประกาศ",
    variant: "success",
    icon: GlobeAltIcon,
  },
  {
    id: "update",
    label: "อัพเดทประกาศ",
    variant: "info",
    icon: PencilIcon,
  },
  {
    id: "report",
    label: "ประกาศถูกรายงาน",
    variant: "warning",
    icon: ExclamationIcon,
  },
  {
    id: "sell",
    label: "ปิดการขาย",
    variant: "info",
    icon: CurrencyDollarIcon,
  },
  {
    id: "close",
    label: "ปิดประกาศ",
    variant: "error",
    icon: XIcon,
  },
];

const getPostActionById = (actionId: string): PostAction => {
  return postActions.find((action) => action.id === actionId) || postActions[0]; // fallback to draft
};

const getPostActionLabelById = (actionId: string): string => {
  return getPostActionById(actionId).label;
};

const getPostActionVariantById = (actionId: string): Variant => {
  return getPostActionById(actionId).variant;
};

const getPostActionIconById = (actionId: string): React.ComponentType<any> => {
  return getPostActionById(actionId).icon;
};

export {
  postActions,
  getPostActionById,
  getPostActionLabelById,
  getPostActionVariantById,
  getPostActionIconById,
};
