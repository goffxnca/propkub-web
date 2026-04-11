import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import PostForm from '@/components/Posts/AddPost/PostForm';
import { AuthContext } from '@/contexts/authContext';
import { useTranslation } from '@/hooks/useTranslation';
import { genPageTitle } from '@/libs/seo-utils';
import Head from 'next/head';

import { useContext } from 'react';

const AddPostPage = () => {
  const { t } = useTranslation('pages/post-form');
  const { t: tCommon } = useTranslation('common');
  const { isAgent } = useContext(AuthContext);

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
