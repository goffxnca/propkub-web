import PostForm from '../../../components/Posts/AddPost/PostForm';
import { genPageTitle } from '../../../libs/seo-utils';
import Head from 'next/head';
import ProtectedRoute from '../../../components/Auth/ProtectedRoute';
import { useTranslation } from '../../../hooks/useTranslation';
import { useContext } from 'react';
import { authContext } from '../../../contexts/authContext';

const AddPostPage = () => {
  const { t } = useTranslation('pages/post-form');
  const { t: tCommon } = useTranslation('common');
  const { isAgent } = useContext(authContext);
  
  const roleLabel = isAgent ? tCommon('roles.agent') : tCommon('roles.normal');
  const pageTitle = `${t('mode.create')} (${roleLabel})`;
  
  return (
    <ProtectedRoute>
      <Head>
        <title>{genPageTitle(pageTitle)}</title>
      </Head>
      <PostForm postData={null} />
    </ProtectedRoute>
  );
};

export default AddPostPage;
