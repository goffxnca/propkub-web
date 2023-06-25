import { useRouter } from "next/router";
import { useContext } from "react";
import AddPostForm from "../../components/Posts/AddPost/AddPostForm";
import Modal from "../../components/UI/Public/Modal";
import { authContext } from "../../contexts/authContext";
import { InformationCircleIcon } from "@heroicons/react/outline";
import Loader from "../../components/UI/Common/modals/Loader";
import { genPageTitle } from "../../libs/seo-utils";
import Head from "next/head";

const AddPostPage = () => {
  const { isAuthenticated, loading } = useContext(authContext);
  const router = useRouter();

  if (loading) return <Loader />;
  if (!isAuthenticated)
    return (
      <Modal
        visible={true}
        title="แจ้งเตือน"
        type="info"
        desc="กรุณาล็อกอินเข้าสู่ระบบก่อนลงประกาศ"
        buttonCaption="ไปยังหน้าล็อกอิน"
        Icon={InformationCircleIcon}
        onClose={() => {
          router.push("/login");
          // setShowSuccessModal(false);
        }}
      />
    );

  return (
    <>
      <Head>
        <title>{genPageTitle("ลงประกาศ (เอเจันท์)")}</title>
      </Head>
      <AddPostForm isMember={true} />
    </>
  );
};

export default AddPostPage;
