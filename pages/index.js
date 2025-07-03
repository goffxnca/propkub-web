import Head from "next/head";
// import Link from "next/link";
// import HeroBanner from "../components/Banner/HeroBanner";
// import StatsBanner from "../components/Banner/Stats";
import PostList from "../components/Posts/PostList";
import { BASE_SITE_URL } from "../libs/constants";
import { getAllProvinces } from "../libs/managers/addressManager";
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
  const provinces = await getAllProvinces();

  const returnProps = {
    props: {
      posts: posts,
      provinces: provinces || [],
    },
  };

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
