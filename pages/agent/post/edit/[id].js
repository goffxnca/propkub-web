import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { getPostById } from "../../../../libs/post-utils";
import { genPageTitle } from "../../../../libs/seo-utils";
import AddPostForm from "../../../../components/Posts/AddPost/AddPostForm";
import { authContext } from "../../../../contexts/authContext";

const AgentPropertyEditPage = () => {
  const router = useRouter();
  const [post, setPost] = useState(null);
  const { user } = useContext(authContext);

  useEffect(() => {
    const fetchPost = async () => {
      const postResult = await getPostById(id);
      if (postResult.createdBy.userId === user.userId) {
        setPost(postResult);
      }
    };

    const id = router.query.id;
    if (id) {
      if (user) {
        fetchPost();
      }
    }
  }, [router.query.id, user]);

  return (
    <>
      <Head>
        <title>{genPageTitle("แก้ไขประกาศ")}</title>
      </Head>
      {post && <AddPostForm isMember={true} postData={post} />}
    </>
  );
};

export default AgentPropertyEditPage;
