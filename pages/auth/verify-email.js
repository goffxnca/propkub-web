import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Modal from '../../components/UI/Public/Modal';
import { apiClient } from '../../libs/client';
import { CheckIcon, ExclamationCircleIcon } from '@heroicons/react/outline';
import { genPageTitle } from '../../libs/seo-utils';
import Head from 'next/head';
import Loader from '../../components/UI/Common/modals/Loader';

const VerifyEmailPage = () => {
  const router = useRouter();
  const { vtoken } = router.query;
  const [message, setMessage] = useState('');

  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      if (vtoken) {
        try {
          await apiClient.auth.verifyEmail(vtoken);
          setMessage('อีเมลของคุณได้รับการยืนยันเรียบร้อย');
        } catch (error) {
          setMessage('ลิ้งค์ยืนยันอีเมลไม่ถูกต้องหรือหมดอายุ');
          setIsError(true);
        } finally {
          setLoading(false);
        }
      }
    };

    verifyEmail();
  }, [vtoken]);

  const modalTitle = isError ? 'เกิดข้อผิดพลาด' : 'ยืนยันอีเมลสำเร็จ';
  const modalType = isError ? 'warning' : 'success';
  const modalIcon = isError ? ExclamationCircleIcon : CheckIcon;
  const modalButtonLabel = isError ? 'กลับหน้าแรก' : 'ไปหน้าโปรไฟล์';

  const onPressModalButton = () => {
    if (window) {
      window.location = isError ? '/' : '/profile';
    }
  };

  return (
    <>
      <Head>
        <title>{genPageTitle('ยืนยันอีเมล')}</title>
      </Head>
      {loading && <Loader />}
      {!loading && (
        <Modal
          visible={true}
          type={modalType}
          title={modalTitle}
          desc={message}
          buttonCaption={modalButtonLabel}
          Icon={modalIcon}
          onClose={onPressModalButton}
        />
      )}
    </>
  );
};

export default VerifyEmailPage;
