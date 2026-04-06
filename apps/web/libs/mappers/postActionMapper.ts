import {
  DocumentAddIcon,
  PencilIcon,
  ExclamationIcon,
  CurrencyDollarIcon,
  XIcon,
  RefreshIcon
} from '@heroicons/react/solid';
import { Variant } from '../utils/style-utils';

export interface PostAction {
  id: string;
  variant: Variant;
  icon: React.ComponentType<any>;
}

const postActions: PostAction[] = [
  {
    id: 'create',
    variant: 'success',
    icon: DocumentAddIcon
  },
  {
    id: 'update',
    variant: 'info',
    icon: PencilIcon
  },
  {
    id: 'suspense',
    variant: 'warning',
    icon: ExclamationIcon
  },
  {
    id: 'restore',
    variant: 'success',
    icon: RefreshIcon
  },
  {
    id: 'sell',
    variant: 'info',
    icon: CurrencyDollarIcon
  },
  {
    id: 'close',
    variant: 'error',
    icon: XIcon
  }
];

const getPostActionById = (actionId: string): PostAction => {
  return postActions.find((action) => action.id === actionId);
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
  getPostActionVariantById,
  getPostActionIconById
};
