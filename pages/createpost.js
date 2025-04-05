import { useRouter } from "next/router";
import { useContext } from "react";
import AddPostForm from "../components/Posts/AddPost/AddPostForm";
import { authContext } from "../contexts/authContext";
import Loader from "../components/UI/Common/modals/Loader";
import { genPageTitle } from "../libs/seo-utils";
import Head from "next/head";
import { BASE_SITE_URL } from "../libs/constants";

const CreatePostPage = () => {
  const { isAuthenticated, loading, isAdmin, isAgent } =
    useContext(authContext);
  const router = useRouter();

  if (loading) return <Loader />;
  if (isAuthenticated && (isAgent || isAdmin)) router.push("/agent/addpost");
  return (
    <>
      <Head>
        <title>{genPageTitle("ลงประกาศฟรี (ผู้ใช้งานทั่วไป)")}</title>
        <meta
          name="description"
          content="ลงประกาศอสังหาฟรี ที่ PropKub.com ไม่มีค่าใช้จ่าย ไม่ต้องสมัครสมาชิก สะดวก รวดเร็ว รองรับประกาศทุกประเภท ทั้งบ้าน คอนโด ที่ดิน ทาวน์โฮมและอาคารพาณิชย์"
        />
        <link rel="canonical" href={BASE_SITE_URL + "/createpost"} />
      </Head>
      <AddPostForm isMemeber={false} />
    </>
  );
};

export default CreatePostPage;
