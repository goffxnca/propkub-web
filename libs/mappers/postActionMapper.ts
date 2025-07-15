import {
  DocumentAddIcon,
  PencilIcon,
  ExclamationIcon,
  CurrencyDollarIcon,
  XIcon,
  RefreshIcon,
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
    id: "create",
    label: "สร้างประกาศ",
    variant: "success",
    icon: DocumentAddIcon,
  },
  {
    id: "update",
    label: "อัพเดทประกาศ",
    variant: "info",
    icon: PencilIcon,
  },
  {
    id: "suspense",
    label: "พักการใช้งาน",
    variant: "warning",
    icon: ExclamationIcon,
  },
  {
    id: "restore",
    label: "เปิดประกาศใหม่",
    variant: "success",
    icon: RefreshIcon,
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
  return postActions.find((action) => action.id === actionId);
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
