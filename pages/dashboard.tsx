import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Modal from "../components/UI/Public/Modal";
import { authContext } from "../contexts/authContext";
import { InformationCircleIcon } from "@heroicons/react/outline";
import Loader from "../components/UI/Common/modals/Loader";
import MyPropertyList from "../components/Dashboard/MyPostList";
import { getAllPostsByUserId } from "../libs/post-utils";
import Head from "next/head";
import { genPageTitle } from "../libs/seo-utils";

const DashboardPage = () => {
  const { isAuthenticated, loading, user } = useContext(authContext);
  const [myPosts, setMyPosts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      const postsResult = await getAllPostsByUserId(user.userId);
      setMyPosts(postsResult);
    };

    if (user && user.userId) {
      fetchPosts();
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

  return (
    <>
      <Head>
        <title>{genPageTitle("แดชบอร์ด")}</title>
      </Head>
      <MyPropertyList myPosts={myPosts} />
    </>
  );
};

export default DashboardPage;
