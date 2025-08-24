import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PageTitle from '../UI/Private/PageTitle';
import { authContext } from '../../contexts/authContext';
import Alert from '../UI/Public/Alert';
import PersonalInfoSection from './PersonalInfoSection';
import ContactInfoSection from './ContactInfoSection';
import AccountDetailsSection from './AccountDetailsSection';
import AccountSecuritySection from './AccountSecuritySection';
import SocialConnectionsSection from './SocialConnectionsSection';
import Button from '../UI/Public/Button';

const ProfileScreen = ({ user }) => {
  const { isProfileComplete } = useContext(authContext);
  const router = useRouter();
  const [warningMessages, setWarningMessages] = useState([]);

  useEffect(() => {
    const messages = [];
    if (!user?.emailVerified) {
      messages.push(
        `เราส่งลิ้งค์ยืนยันอีเมลไปที่ ${user?.email} กรุณายืนยันว่าคุณเป็นเจ้าของอีเมล (หากไม่พบอีเมล กรุณาตรวจสอบในโฟลเดอร์ Spam/Junk/Promotions)`
      );
    }
    if (!isProfileComplete) {
      messages.push(
        'กรุณากำหนดชื่อ รูปภาพโปรไฟล์ หมายเลขโทรศัพท์และไลน์ไอดี เพื่อให้ผู้เข้าชมประกาศสามารถติดต่อคุณได้'
      );
    }
    setWarningMessages(messages);
  }, [user?.emailVerified, isProfileComplete, user?.email]);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">กำลังโหลดข้อมูลโปรไฟล์...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <PageTitle label="โปรไฟล์ของฉัน" />
        {isProfileComplete && (
          <div className="animate-bounce">
            <Button
              type="submit"
              variant="primary"
              onClick={() => {
                router.push('/account/posts/create');
              }}
            >
              ลงประกาศ
            </Button>
          </div>
        )}
      </div>

      {warningMessages.length > 0 && (
        <div className="animate-pulse mt-6">
          <Alert
            alertTitle="ก่อนลงประกาศกรุณาดำเนินการต่อไปนี้:"
            messages={warningMessages}
            showButton={true}
            buttonLabel={'ตรวจสอบอีกครั้ง'}
            onClick={() => {
              router.reload();
            }}
          />
        </div>
      )}

      <div className="space-y-6">
        <PersonalInfoSection user={user} />
        <AccountDetailsSection user={user} />
        <ContactInfoSection user={user} />
        <SocialConnectionsSection user={user} />
        <AccountSecuritySection user={user} />
      </div>
    </div>
  );
};

export default ProfileScreen;
