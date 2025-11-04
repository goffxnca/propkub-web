import React from 'react';
import Badge from '../../UI/Badge';
import { getStatusVariantById } from '../../../libs/mappers/statusMapper';
import { useTranslation } from '../../../hooks/useTranslation';

interface PostStatusBadgeProps {
  status: string;
}

const PostStatusBadge = ({ status }: PostStatusBadgeProps) => {
  const { t } = useTranslation('posts');
  const variant = getStatusVariantById(status);
  const label = t(`statuses.${status}`);

  return <Badge variant={variant}>{label}</Badge>;
};

export default PostStatusBadge;
