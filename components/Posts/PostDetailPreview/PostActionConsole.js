import { useState } from 'react';
import Button from '../../UI/Public/Button';
import { CheckIcon, ExclamationIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import Confirm from '../../UI/Public/Modals/Confirm';
import Modal from '../../UI/Public/Modal';
import { apiClient } from '../../../libs/client';
import { useTranslation } from '../../../hooks/useTranslation';

const PostActionConsole = ({ postId, postSlug, postStatus }) => {
  const router = useRouter();
  const { t: tPage } = useTranslation('pages/account-post');
  const { t: tCommon } = useTranslation('common');

  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const closePostHandler = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    try {
      await apiClient.posts.closePost(postId);
      setShowSuccessModal(true);
      setLoading(false);
    } catch (error) {
      console.error('Failed to close post:', error);
      setLoading(false);
      setErrorMessage('เกิดข้อผิดพลาดในการปิดประกาศ กรุณาลองใหม่อีกครั้ง');
      setShowErrorModal(true);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg p-4 min-h-[100px]">
      <h3 className="text-lg font-medium leading-6 text-gray-900"></h3>
      <div className="grid grid-cols-2 gap-x-2">
        {postStatus === 'active' && (
          <Button
            variant="primary"
            loading={false}
            onClick={() => {
              router.push(`/account/posts/edit/${postId}`);
            }}
          >
            {tPage('actions.edit')}
          </Button>
        )}

        <Button
          variant="primary"
          loading={false}
          onClick={() => {
            window.open(`/property/${postSlug}`);
          }}
        >
          {tPage('actions.view')}
        </Button>
        {postStatus === 'active' && (
          <Button
            variant="accent"
            loading={loading}
            onClick={() => {
              setShowConfirmModal(true);
            }}
          >
            {tPage('actions.close')}
          </Button>
        )}
      </div>

      <Modal
        visible={showSuccessModal}
        title={tPage('success.close.title')}
        desc={tPage('success.close.description')}
        buttonCaption={tCommon('buttons.ok')}
        Icon={CheckIcon}
        onClose={() => {
          router.reload();
        }}
      />

      <Confirm
        visible={showConfirmModal}
        title={tPage('confirm.close.title')}
        desc={tPage('confirm.close.description')}
        buttonCancelLabel={tCommon('buttons.cancel')}
        buttonConfirmLabel={tCommon('buttons.confirm')}
        onConfirm={closePostHandler}
        onClose={() => {
          setShowConfirmModal(false);
        }}
      />

      <Modal
        visible={showErrorModal}
        Icon={ExclamationIcon}
        type="warning"
        title={tCommon('error.generic.title')}
        desc={errorMessage}
        buttonCaption={tCommon('buttons.ok')}
        onClose={() => {
          setShowErrorModal(false);
          setErrorMessage('');
        }}
      />
    </div>
  );
};

export default PostActionConsole;
