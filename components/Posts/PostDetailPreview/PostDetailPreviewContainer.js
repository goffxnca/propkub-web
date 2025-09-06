import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Loader from '../../UI/Common/modals/Loader';
import Modal from '../../UI/Public/Modal';
import { apiClient } from '../../../libs/client';
import { genPageTitle } from '../../../libs/seo-utils';
import { ExclamationCircleIcon } from '@heroicons/react/outline';
import PostDetailPreview from './PostDetailPreview';

const PostDetailPreviewContainer = ({ postId }) => {
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [postActions, setPostActions] = useState([]);
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
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูลประกาศ กรุณาลองใหม่อีกครั้ง');
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
        title="เกิดข้อผิดพลาด"
        type="warning"
        desc={error}
        buttonCaption="กลับไปแดชบอร์ด"
        Icon={ExclamationCircleIcon}
        onClose={() => {
          router.push('/dashboard');
        }}
      />
    );
  }

  // No post found
  if (!post) return null;

  return (
    <>
      <Head>
        <title>
          {genPageTitle(`ประกาศหมายเลข ${post.postNumber || post._id}`)}
        </title>
      </Head>
      <PostDetailPreview post={post} postActions={postActions} />
    </>
  );
};

export default PostDetailPreviewContainer;
