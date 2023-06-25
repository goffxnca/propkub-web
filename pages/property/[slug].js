import Head from "next/head";
import PostDetail from "../../components/Posts/PostDetail/PostDetail";
import {
  genPropertyDescriptionMeta,
  genPropertyTitleMeta,
} from "../../libs/seo-utils";
import {
  getPostById,
  getAllActivePosts,
  getSixSimilarPosts,
} from "../../libs/post-utils";
import { BASE_SITE_URL } from "../../libs/constants";
import { useEffect, useState } from "react";
import { getPostView, increasePostView } from "../../libs/managers/postManager";
import { useRouter } from "next/router";
import { addLog } from "../../libs/managers/logManager";

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

  useEffect(() => {
    const { a, t } = router.query;
    if (a && t) {
      //add log when clicking from email
      addLog({
        action: a,
        type: t,
        payload: {
          postId: post.id,
          postNumber: post.postNumber,
          link: window.location.href,
        },
      });
    }
  }, [router.query]);

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

//change to SSR for now
export async function getServerSideProps({ params }) {
  const slugSegments = params.slug.split("_");
  const propertyId = slugSegments[slugSegments.length - 1];

  const post = await getPostById(propertyId);
  const similarPosts = await getSixSimilarPosts({
    assetType: post?.assetType,
    postType: post?.postType,
  });

  return {
    props: {
      post: post,
      similarPosts: similarPosts.filter((p) => p.id !== post?.id),
    },
    notFound: !post,
  };
}

//Disable ISR for now
// export async function getStaticPaths({}) {
//   const posts = await getAllActivePosts();
//   const paths = posts.map((post) => ({
//     params: {
//       slug: post.slug,
//     },
//   }));

//   return {
//     paths,
//     fallback: "blocking",
//   };
// }

// export async function getStaticProps({ params }) {
//   const slugSegments = params.slug.split("_");
//   const propertyId = slugSegments[slugSegments.length - 1];

//   const post = await getPostById(propertyId);
//   const similarPosts = await getSixSimilarPosts({
//     assetType: post?.assetType,
//     postType: post?.postType,
//   });

//   return {
//     props: {
//       post: post,
//       similarPosts: similarPosts.filter((p) => p.id !== post?.id),
//     },
//     notFound: !post,
//   };
// }

export default PropertyDetailPage;
