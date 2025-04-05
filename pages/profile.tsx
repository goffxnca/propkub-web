import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Modal from "../components/UI/Public/Modal";
import { authContext } from "../contexts/authContext";
import { InformationCircleIcon } from "@heroicons/react/outline";
import ProfileForm from "../components/Profile/ProfileForm";
import { getUserById } from "../libs/managers/userManager";
import Loader from "../components/UI/Common/modals/Loader";
import Head from "next/head";
import { genPageTitle } from "../libs/seo-utils";

const ProfilePage = () => {
  const { isAuthenticated, loading, user } = useContext(authContext);
  const [userProfile, setUserProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userProfileData = await getUserById(user.userId);

      setUserProfile(userProfileData);
    };

    if (user && user.userId) {
      fetchUserProfile();
    }
  }, [user]);

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated)
    return (
      <Modal
        visible={true}
        title="แจ้งเตือน"
        type="info"
        desc="กรุณาล็อกอินเข้าสู่ระบบ เพื่อเข้าถึง URL นี้"
        buttonCaption="ไปยังหน้าล็อกอิน"
        Icon={InformationCircleIcon}
        onClose={() => {
          router.push("/login");
          // setShowSuccessModal(false);
        }}
      />
    );

  if (!userProfile) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>{genPageTitle("โปรไฟล์ของฉัน")}</title>
      </Head>
      <ProfileForm profile={userProfile} />
    </>
  );
};

export default ProfilePage;
