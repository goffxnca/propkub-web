import { useContext } from "react";
import Head from "next/head";
import { authContext } from "../contexts/authContext";
import { genPageTitle } from "../libs/seo-utils";
import ProtectedRoute from "../components/Auth/ProtectedRoute";
import Profile2Screen from "../components/Profile2/Profile2Screen";

const Profile2Page = () => {
  const { user } = useContext(authContext);

  return (
    <ProtectedRoute>
      <Head>
        <title>{genPageTitle("โปรไฟล์ของฉัน")}</title>
      </Head>
      <Profile2Screen user={user} />
    </ProtectedRoute>
  );
};

export default Profile2Page; 