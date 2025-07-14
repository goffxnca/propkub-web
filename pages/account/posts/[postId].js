import { useRouter } from "next/router";
import PostDetailPreviewContainer from "../../../components/Posts/PostDetailPreview/PostDetailPreviewContainer";
import ProtectedRoute from "../../../components/Auth/ProtectedRoute";

const PostDetailPreviewPage = () => {
  const router = useRouter();
  const { postId } = router.query;

  return (
    <ProtectedRoute>
      <PostDetailPreviewContainer postId={postId} />
    </ProtectedRoute>
  );
};

export default PostDetailPreviewPage;
