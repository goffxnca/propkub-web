import PostForm from "../../../components/Posts/AddPost/PostForm";
import { genPageTitle } from "../../../libs/seo-utils";
import Head from "next/head";
import ProtectedRoute from "../../../components/Auth/ProtectedRoute";

const AddPostPage = () => {
  return (
    <ProtectedRoute>
      <Head>
        <title>{genPageTitle("ลงประกาศ (เอเจันท์)")}</title>
      </Head>
      <PostForm postData={null} />
    </ProtectedRoute>
  );
};

export default AddPostPage;
