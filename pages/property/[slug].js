import Head from "next/head";
import PostDetail from "../../components/Posts/PostDetail/PostDetail";
import {
  genPropertyDescriptionMeta,
  genPropertyTitleMeta,
} from "../../libs/seo-utils";
import { FetchPostByNumber, FetchSimilarPosts } from "../../libs/post-utils";
import { BASE_SITE_URL } from "../../libs/constants";

const PropertyDetailPage = ({ post, similarPosts }) => {
  return (
    <>
      <Head>
        <title>{genPropertyTitleMeta(post.title)}</title>
        <meta
          name="description"
          content={genPropertyDescriptionMeta(post.desc)}
          key="desc"
        />
        <link rel="canonical" href={BASE_SITE_URL + "/property/" + post.slug} />

        <meta property="og:title" content={post.title} />
        <meta
          property="og:description"
          content={genPropertyDescriptionMeta(post.desc)}
        />
        <meta property="og:image" content={post.thumbnail} />
        <meta
          property="og:url"
          content={BASE_SITE_URL + "/property/" + post.slug}
        />
      </Head>
      <PostDetail post={post} similarPosts={similarPosts} />
    </>
  );
};

// Always fetch fresh post and similarPosts data from API (SSR)
export async function getServerSideProps({ params }) {
  const slugSegments = params.slug.split("_");
  const postNumber = slugSegments[slugSegments.length - 1];

  const post = await FetchPostByNumber(postNumber);
  const similarPosts = post ? await FetchSimilarPosts(post._id) : [];

  return {
    props: {
      post,
      similarPosts: similarPosts || [],
    },
    notFound: !post,
  };
}

export default PropertyDetailPage;
