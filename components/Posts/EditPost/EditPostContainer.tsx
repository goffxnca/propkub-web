import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Loader from '../../UI/Common/modals/Loader';
import Modal from '../../UI/Public/Modal';
import { apiClient } from '../../../libs/client';
import { genPageTitle } from '../../../libs/seo-utils';
import { ExclamationCircleIcon } from '@heroicons/react/outline';
import { useTranslation } from '../../../hooks/useTranslation';
import PostForm from '../AddPost/PostForm';

const EditPostContainer = ({ postId }) => {
  const router = useRouter();
  const { t } = useTranslation('pages/post-form');
  const { t: tCommon } = useTranslation('common');
  const [post, setPost] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPostData = async () => {
      setFetching(true);
      setError('');

      try {
        const postData = await apiClient.posts.getByIdForOwner(postId);
        setPost(postData);
      } catch (err) {
        console.error('Error fetching a post:', err);
        setError(tCommon('error.generic.description'));
        setPost(null);
      } finally {
        setFetching(false);
      }
    };

    fetchPostData();
  }, [postId]);

  if (fetching) return <Loader />;

  if (error) {
    return (
      <Modal
        visible={true}
        title={tCommon('error.generic.title')}
        type="warning"
        desc={error}
        buttonCaption={tCommon('buttons.goHome')}
        Icon={ExclamationCircleIcon}
        onClose={() => {
          router.push('/dashboard');
        }}
      />
    );
  }

  if (!post) return null;

  return (
    <>
      <Head>
        <title>{genPageTitle(t('mode.edit', { postNumber: post.postNumber }))}</title>
      </Head>
      <PostForm postData={post} />
    </>
  );
};

export default EditPostContainer;
