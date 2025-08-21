import Head from 'next/head';
// import Link from "next/link";
// import HeroBanner from "../components/Banner/HeroBanner";
// import StatsBanner from "../components/Banner/Stats";
import PostList from '../components/Posts/PostList';
import { BASE_SITE_URL } from '../libs/constants';
import { fetchProvinces } from '../libs/managers/addressManager';
import { fetchActivePosts } from '../libs/post-utils';
import { genPageTitle } from '../libs/seo-utils';

const HomePage = ({ posts, provinces, hasError }) => {
  return (
    <>
      <Head>
        <title>ลงประกาศอสังหาฟรี Propkub.com</title>
        <meta
          name="description"
          content="PropKub.com ตัวช่วยค้นหา/ลงประกาศ อสังหาริมทรัพย์ทุกประเทศ ไม่ว่าจะเป็นการซื้อ-ขาย-เช่า บ้าน ที่ดิน ทาวน์โฮม คอนโด อาคารพาณิชย์ ใช้งานฟรีไม่มีค่าใช้จ่าย"
        />
        <link rel="canonical" href={BASE_SITE_URL} />
      </Head>
      {/* <HeroBanner /> */}
      {/* <StatsBanner /> */}
      <PostList posts={posts} provinces={provinces} hasError={hasError} />
    </>
  );
};

export async function getStaticProps() {
  let posts = [];
  let provinces = [];
  let hasError = false;

  try {
    posts = await fetchActivePosts(process.env.HOMEPAGE_LIMIT);
  } catch (error) {
    console.error('Failed to fetch posts for homepage:', error);
    hasError = true;
    posts = [];
  }

  try {
    provinces = await fetchProvinces();
  } catch (error) {
    console.error('Failed to fetch provinces for homepage:', error);
    hasError = true;
    provinces = [];
  }

  const returnProps = {
    props: {
      posts: posts,
      provinces: provinces || [],
      hasError: hasError
    }
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
   *   3. fetchProvinces() only runs during these regenerations
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
    `HomePage.getStaticProps: posts.length=${posts.length}, provinces.length=${provinces.length}, revalidateInSecond=${revalidateInSecond}, hasError=${hasError}`
  );

  return returnProps;
}

export default HomePage;
