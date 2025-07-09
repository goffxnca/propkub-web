import AddPostForm from "../../components/Posts/AddPost/AddPostForm";
import { genPageTitle } from "../../libs/seo-utils";
import Head from "next/head";
import ProtectedRoute from "../../components/Auth/ProtectedRoute";

const AddPostPage = () => {
  return (
    <ProtectedRoute>
      <Head>
        <title>{genPageTitle("ลงประกาศ (เอเจันท์)")}</title>
      </Head>
      <AddPostForm isMember={true} />
    </ProtectedRoute>
  );
};

export default AddPostPage;
