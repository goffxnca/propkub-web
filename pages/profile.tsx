import { useContext } from "react";
import Head from "next/head";
import { authContext } from "../contexts/authContext";
import { genPageTitle } from "../libs/seo-utils";
import ProtectedRoute from "../components/Auth/ProtectedRoute";
import ProfileScreen from "../components/Profile/ProfileScreen";

const ProfilePage = () => {
  const { user } = useContext(authContext);

  return (
    <ProtectedRoute>
      <Head>
        <title>{genPageTitle("โปรไฟล์ของฉัน")}</title>
      </Head>
      <ProfileScreen user={user} />
    </ProtectedRoute>
  );
};

export default ProfilePage; 