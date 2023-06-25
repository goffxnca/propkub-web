import { useContext } from "react";
import GoogleIndexing from "../../components/Guides/GoogleIndexing";
import { authContext } from "../../contexts/authContext";
import Head from "next/head";
import { genPageTitle } from "../../libs/seo-utils";

const GoogleIndexingPage = () => {
  const { isAuthenticated } = useContext(authContext);
  if (!isAuthenticated) return null;
  return (
    <>
      <Head>
        <title>{genPageTitle("คำแนะนำเกี่ยวกับการติด Google")}</title>
        <meta name="robots" content="noindex, nofollow"></meta>
      </Head>
      <GoogleIndexing />
    </>
  );
};

export default GoogleIndexingPage;
