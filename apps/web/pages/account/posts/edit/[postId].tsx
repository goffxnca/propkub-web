import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import EditPostContainer from '@/components/Posts/EditPost/EditPostContainer';
import { useRouter } from 'next/router';

const EditPostPage = () => {
  const router = useRouter();
  const { postId } = router.query;

  return (
    <ProtectedRoute>
      <EditPostContainer postId={postId} />
    </ProtectedRoute>
  );
};

export default EditPostPage;
