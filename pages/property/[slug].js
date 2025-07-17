import Head from "next/head";
import PostDetail from "../../components/Posts/PostDetail/PostDetail";
import {
  genPropertyDescriptionMeta,
  genPropertyTitleMeta,
} from "../../libs/seo-utils";
import {
  FetchPostByNumberServerSide,
  FetchSimilarPostsServerSide,
} from "../../libs/post-utils";
import { BASE_SITE_URL } from "../../libs/constants";
import { useEffect, useState } from "react";
import { getPostView, increasePostView } from "../../libs/managers/postManager";
import { useRouter } from "next/router";

const PropertyDetailPage = ({ post, similarPosts }) => {
  const [postViews, setPostViews] = useState(-1);
  const router = useRouter();

  useEffect(() => {
    if (post.id) {
      getPostView(post.id)
        .then((result) => {
          setPostViews(result.data);
          increasePostView(post.id);
        })
        .catch((ex) => {
          console.error(ex);
        });
    }
  }, [router.asPath]);

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
      <PostDetail
        post={post}
        postViews={postViews}
        similarPosts={similarPosts}
      />
    </>
  );
};

// Always fetch fresh post and similarPosts data from API (SSR)
export async function getServerSideProps({ params }) {
  const slugSegments = params.slug.split("_");
  const postNumber = slugSegments[slugSegments.length - 1];

  const post = await FetchPostByNumberServerSide(postNumber);
  console.log("post SSR", post);
  const similarPosts = post
    ? await FetchSimilarPostsServerSide({
        assetType: post.assetType,
        postType: post.postType,
        postId: post.id,
      })
    : [];

  return {
    props: {
      post,
      similarPosts,
    },
    notFound: !post,
  };
}

export default PropertyDetailPage;
