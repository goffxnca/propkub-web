import Badge from "../../UI/Badge/Badge";
import { getStatusLabelById, getStatusVariantById } from "../../../libs/mappers/statusMapper";

const PostStatusBadge = ({ status, showDot = true }) => {
  const variant = getStatusVariantById(status);
  const label = getStatusLabelById(status);

  return (
    <Badge variant={variant} showDot={showDot}>
      {label}
    </Badge>
  );
};

export default PostStatusBadge; 