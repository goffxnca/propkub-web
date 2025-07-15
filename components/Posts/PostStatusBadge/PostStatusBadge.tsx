import React from "react";
import Badge from "../../UI/Badge/Badge";
import { getStatusLabelById, getStatusVariantById } from "../../../libs/mappers/statusMapper";

interface PostStatusBadgeProps {
  status: string;
}

const PostStatusBadge: React.FC<PostStatusBadgeProps> = ({ status }) => {
  const variant = getStatusVariantById(status);
  const label = getStatusLabelById(status);

  return (
    <Badge variant={variant}>
      {label}
    </Badge>
  );
};

export default PostStatusBadge; 