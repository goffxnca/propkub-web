import MyPropertyList from "../components/Dashboard/MyPostList";
import Head from "next/head";
import { genPageTitle } from "../libs/seo-utils";
import ProtectedRoute from "../components/Auth/ProtectedRoute";

const DashboardPage = () => {
  return (
    <ProtectedRoute>
      <Head>
        <title>{genPageTitle("แดชบอร์ด")}</title>
      </Head>
      <MyPropertyList />
    </ProtectedRoute>
  );
};

export default DashboardPage;
