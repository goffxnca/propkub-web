import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import PostDetailPreviewContainer from '@/components/Posts/PostDetailPreview/PostDetailPreviewContainer';
import { useRouter } from 'next/router';

const PostDetailPreviewPage = () => {
  const router = useRouter();
  const { postId } = router.query;

  return (
    <ProtectedRoute>
      <PostDetailPreviewContainer postId={postId as string} />
    </ProtectedRoute>
  );
};

export default PostDetailPreviewPage;
