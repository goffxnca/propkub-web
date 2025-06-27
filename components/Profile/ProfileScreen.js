import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import PageTitle from "../UI/Private/PageTitle";
import { authContext } from "../../contexts/authContext";
import Alert2 from "../UI/Public/Alert2";
import ProfileSection from "./ProfileSection";
import PasswordSection from "./PasswordSection";

const ProfileScreen = ({ profile }) => {
  const { isProfileComplete } = useContext(authContext);
  const router = useRouter();
  const [warningMessages, setWarningMessages] = useState([]);

  useEffect(() => {
    const messages = [];
    if (!profile.emailVerified) {
      messages.push(
        `เราส่งลิ้งค์ยืนยันอีเมลไปที่ ${profile.email} กรุณายืนยันว่าคุณเป็นเจ้าของอีเมล`
      );
    }
    if (!isProfileComplete) {
      messages.push(
        "กรุณาอัพเดทโปรไฟล์ของคุณให้เรียบร้อย เพื่อให้ผู้เข้าชมประกาศสามารถติดต่อคุณได้"
      );
    }
    setWarningMessages(messages);
  }, [profile.emailVerified, isProfileComplete, profile.email]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <PageTitle label="โปรไฟล์ของฉัน" />

      {warningMessages.length > 0 && (
        <div className="mb-6">
          <Alert2
            alertTitle="ก่อนลงประกาศกรุณาดำเนินการต่อไปนี้:"
            messages={warningMessages}
            showButton={true}
            buttonLabel={"ตรวจสอบอีกครั้ง"}
            onClick={() => {
              router.reload();
            }}
          />
        </div>
      )}

      <div className="space-y-6">
        {/* Profile Section - Self-contained */}
        <ProfileSection userProfile={profile} />

        {/* Password Section - Self-contained */}
        <PasswordSection />
      </div>
    </div>
  );
};

export default ProfileScreen;
