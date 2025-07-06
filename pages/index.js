import Head from "next/head";
// import Link from "next/link";
// import HeroBanner from "../components/Banner/HeroBanner";
// import StatsBanner from "../components/Banner/Stats";
import PostList from "../components/Posts/PostList";
import { BASE_SITE_URL } from "../libs/constants";
import { fetchProvincesServerSide } from "../libs/managers/addressManager";
import { getAllActivePosts } from "../libs/post-utils";
import { genPageTitle } from "../libs/seo-utils";

const HomePage = ({ posts, provinces }) => {
  console.log("HomePage");

  return (
    <>
      <Head>
        {/* <title>ลงประกาศอสังหาฟรี Propkub.com</title> */}
        <meta
          name="description"
          content="PropKub.com ตัวช่วยค้นหา/ลงประกาศ อสังหาริมทรัพย์ทุกประเทศ ไม่ว่าจะเป็นการซื้อ-ขาย-เช่า บ้าน ที่ดิน ทาวน์โฮม คอนโด อาคารพาณิชย์ ใช้งานฟรีไม่มีค่าใช้จ่าย"
        />
        <link rel="canonical" href={BASE_SITE_URL} />
      </Head>
      {/* <HeroBanner /> */}
      {/* <StatsBanner /> */}
      <PostList posts={posts} provinces={provinces} />
    </>
  );
};

export async function getStaticProps() {
  const posts = await getAllActivePosts(process.env.HOMEPAGE_LIMIT);
  const provinces = await fetchProvincesServerSide();

  const returnProps = {
    props: {
      posts: posts,
      provinces: provinces || [],
    },
  };

  /**
   * Next.js Incremental Static Regeneration (ISR) Configuration
   * 
   * Development Mode:
   * - getStaticProps runs on EVERY request
   * - provinces will be fetched from API on every page load
   * - revalidation setting has no effect
   * 
   * Production Mode:
   * - Initial: Runs at build time, creates static HTML/JSON
   * - Subsequent: Page revalidates based on HOMEPAGE_REVALIDATION seconds
   * - If HOMEPAGE_REVALIDATION=1800 (30 mins):
   *   1. First visit after 30 mins triggers background regeneration
   *   2. New visitors continue seeing old version until regeneration completes
   *   3. fetchProvincesServerSide() only runs during these regenerations
   *   4. Client-side still uses localStorage cache independent of this setting
   * 
   * Note: This affects both posts and provinces data freshness.
   * Choose HOMEPAGE_REVALIDATION based on how often this data changes.
   */
  const revalidateInSecond = process.env.HOMEPAGE_REVALIDATION;

  if (revalidateInSecond) {
    returnProps.revalidate = +revalidateInSecond;
  }
  console.log(
    `HomePage.getStaticProps: posts.length=${posts.length}, revalidateInSecond=${revalidateInSecond}`
  );

  return returnProps;
}

export default HomePage;
