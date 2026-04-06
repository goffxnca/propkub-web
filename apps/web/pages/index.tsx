import Head from 'next/head';
import type { GetStaticProps } from 'next';
import { Post } from '@/types/models/post';
import { Province } from '@/types/models/address';
import { useTranslation } from '@/hooks/useTranslation';
import { BASE_SITE_URL } from '@/libs/constants';
import PostList from '@/components/Posts/PostList';
import { fetchActivePosts } from '@/libs/post-utils';
import { fetchProvinces } from '@/libs/managers/addressManager';
// import Link from "next/link";
// import HeroBanner from "../components/Banner/HeroBanner";
// import StatsBanner from "../components/Banner/Stats";

interface HomePageProps {
  posts: Post[];
  provinces: Province[];
  hasError: boolean;
}

const HomePage = ({ posts, provinces, hasError }: HomePageProps) => {
  const { t } = useTranslation('posts');
  const { t: tCommon } = useTranslation('common');

  return (
    <>
      <Head>
        <title>{t('list.pageTitle')}</title>
        <meta
          name="description"
          content={tCommon('meta.defaultDescription', {
            page: t('list.pageTitle')
          })}
        />
        <link rel="canonical" href={BASE_SITE_URL} />
      </Head>
      {/* <HeroBanner /> */}
      {/* <StatsBanner /> */}
      <PostList posts={posts} provinces={provinces} hasError={hasError} />
    </>
  );
};

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  let posts: Post[] = [];
  let provinces: Province[] = [];
  let hasError = false;

  try {
    posts = await fetchActivePosts();
  } catch (error: unknown) {
    console.error(
      'Failed to fetch posts for homepage:',
      error instanceof Error ? error.message : error
    );
    hasError = true;
    posts = [];
  }

  try {
    provinces = await fetchProvinces();
  } catch (error: unknown) {
    console.error(
      'Failed to fetch provinces for homepage:',
      error instanceof Error ? error.message : error
    );
    hasError = true;
    provinces = [];
  }

  const returnProps: {
    props: HomePageProps;
    revalidate?: number;
  } = {
    props: {
      posts,
      provinces: provinces || [],
      hasError
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
};

export default HomePage;
