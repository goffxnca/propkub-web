import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CheckIcon, ExclamationCircleIcon } from '@heroicons/react/outline';
import Head from 'next/head';
import { apiClient } from '@/libs/client';
import { genPageTitle } from '@/libs/seo-utils';
import Loader from '@/components/UI/Common/modals/Loader';
import Modal from '@/components/UI/Modal';

const VerifyEmailPage = () => {
  const router = useRouter();
  const { vtoken } = router.query;
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async (): Promise<void> => {
      const token = Array.isArray(vtoken) ? vtoken[0] : vtoken;
      if (token) {
        try {
          await apiClient.auth.verifyEmail(token);
          setMessage('อีเมลของคุณได้รับการยืนยันเรียบร้อย');
        } catch (error: unknown) {
          console.error('Email verification error:', error);
          setMessage('ลิ้งค์ยืนยันอีเมลไม่ถูกต้องหรือหมดอายุ');
          setIsError(true);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [vtoken]);

  const modalTitle = isError ? 'เกิดข้อผิดพลาด' : 'ยืนยันอีเมลสำเร็จ';
  const modalType = isError ? 'warning' : 'success';
  const modalIcon = isError ? ExclamationCircleIcon : CheckIcon;
  const modalButtonLabel = isError ? 'กลับหน้าแรก' : 'ไปหน้าโปรไฟล์';

  const onPressModalButton = () => {
    const path = isError ? '/' : '/profile';
    router.push(path);
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
