import { getPostById } from "../../../libs/post-utils";

//This route is just used for posting on FB to have a short URL, but in the end will be redirected to normal url
const PropertyListingRedirect = () => {};

export async function getServerSideProps({ params }) {
  console.log("params", params);
  const post = await getPostById(params.postId);

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    redirect: {
      permanent: false,
      destination: `/property/${post.slug}`,
    },
  };
}

export default PropertyListingRedirect;
