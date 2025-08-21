import { useRouter } from 'next/router';
import ProtectedRoute from '../../../../components/Auth/ProtectedRoute';
import EditPostContainer from '../../../../components/Posts/EditPost/EditPostContainer';

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
