import Badge from '@/components/UI/Badge';
import { useTranslation } from '@/hooks/useTranslation';
import { getStatusVariantById } from '@/libs/mappers/statusMapper';

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
