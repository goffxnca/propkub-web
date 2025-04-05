import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import PostDetailPreview from "../../../components/Posts/PostDetailPreview/PostDetailPreview";
import Loader from "../../../components/UI/Common/modals/Loader";
import Modal from "../../../components/UI/Public/Modal";
import { authContext } from "../../../contexts/authContext";
import { getPostActions } from "../../../libs/managers/postActionManager";
import { getPostById } from "../../../libs/post-utils";
import { InformationCircleIcon } from "@heroicons/react/outline";
import Head from "next/head";
import { genPageTitle } from "../../../libs/seo-utils";

const PostDetailPreviewPage = () => {
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [postActions, setPostActions] = useState([]);
  const [fetching, setFetching] = useState(true);
  const { isAuthenticated, loading } = useContext(authContext);

  useEffect(() => {
    const { postId } = router.query;

    if (postId) {
      setFetching(true);
      getPostById(postId).then((result) => {
        setPost(result);
        getPostActions(postId).then((response) => {
          setPostActions(response.data);
          setFetching(false);
        });
      });
    }
  }, [router.asPath]);

  if (loading || fetching) return <Loader />;
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
        }}
      />
    );

  if (!post) return null;
  return (
    <>
      <Head>
        <title>{genPageTitle(`ประกาศหมายเลข ${post.postNumber}`)}</title>
      </Head>
      <PostDetailPreview post={post} postActions={postActions} />
    </>
  );
};

export default PostDetailPreviewPage;
