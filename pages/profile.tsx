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
import ProtectedRoute from "../components/Auth/ProtectedRoute";

const ProfilePage = () => {
  const { user } = useContext(authContext);

  return (
    <ProtectedRoute>
      <Head>
        <title>{genPageTitle("โปรไฟล์ของฉัน")}</title>
      </Head>
      <ProfileForm profile={user} />
    </ProtectedRoute>
  );
};

export default ProfilePage;
