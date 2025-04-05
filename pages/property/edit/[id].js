import Head from "next/head";
import { genPageTitle } from "../../../libs/seo-utils";
import { getPostById } from "../../../libs/post-utils";
import { useEffect, useState } from "react";
import AddPostForm from "../../../components/Posts/AddPost/AddPostForm";
import { useRouter } from "next/router";
import PasscodeVallidator from "../../../components/Posts/AddPost/PasscodeValidator";

const PropertyEditPage = () => {
  const [post, setPost] = useState(null);
  const router = useRouter();
  const [passcodeChecked, setPasscodeChecked] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      const id = router.query.id;
      if (id) {
        const postResult = await getPostById(id);
        setPost(postResult);
      }
    };

    fetchPost();
  }, [router.query.id]);

  return (
    <>
      <Head>
        <title>{genPageTitle("แก้ไขประกาศ")}</title>
      </Head>
      {post && !passcodeChecked && (
        <PasscodeVallidator
          passcode={post?.contact?.passcode}
          onSuccess={() => {
            setPasscodeChecked(true);
          }}
        />
      )}
      {post && passcodeChecked && (
        <AddPostForm isMember={false} postData={post} />
      )}
    </>
  );
};

export default PropertyEditPage;
