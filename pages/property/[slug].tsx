import Head from 'next/head';
import type { GetServerSideProps } from 'next';
import { Post } from '@/types/models/post';
import { User } from '@/types/models/user';
import {
  genPropertyDescriptionMeta,
  genPropertyTitleMeta
} from '@/libs/seo-utils';
import { BASE_SITE_URL } from '@/libs/constants';
import PostDetail from '@/components/Posts/PostDetail/PostDetail';
import { FetchPostByNumber, FetchSimilarPosts } from '@/libs/post-utils';

interface PropertyDetailPageProps {
  post: Post & { createdBy: User };
  similarPosts: Post[];
}

const PropertyDetailPage = ({
  post,
  similarPosts
}: PropertyDetailPageProps) => {
  return (
    <>
      <Head>
        <title>{genPropertyTitleMeta(post.title)}</title>
        <meta
          name="description"
          content={genPropertyDescriptionMeta(post.desc)}
          key="desc"
        />
        <link rel="canonical" href={BASE_SITE_URL + '/property/' + post.slug} />

        <meta property="og:title" content={post.title} />
        <meta
          property="og:description"
          content={genPropertyDescriptionMeta(post.desc)}
        />
        <meta property="og:image" content={post.thumbnail} />
        <meta
          property="og:url"
          content={BASE_SITE_URL + '/property/' + post.slug}
        />
      </Head>
      <PostDetail post={post} similarPosts={similarPosts} />
    </>
  );
};

// Always fetch fresh post and similarPosts data from API (SSR)
export const getServerSideProps: GetServerSideProps<
  PropertyDetailPageProps
> = async ({ params }) => {
  const slug = (params?.slug as string) || '';
  const parts = slug.split('_');
  const postNumber = parts[parts.length - 1];

  if (!postNumber) {
    return { notFound: true };
  }

  try {
    const post = await FetchPostByNumber(postNumber);

    if (!post) {
      return { notFound: true };
    }

    const similarPosts = await FetchSimilarPosts(post._id);

    return {
      props: {
        post: post as Post & { createdBy: User },
        similarPosts: similarPosts || []
      }
    };
  } catch (error: unknown) {
    console.error(
      'Error occurred while fetching a post/similar posts:',
      error instanceof Error ? error.message : error
    );
    return { notFound: true };
  }
};

export default PropertyDetailPage;
