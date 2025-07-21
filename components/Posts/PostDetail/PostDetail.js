import { getStatusLabelById } from "../../../libs/mappers/statusMapper";
import Card from "../../UI/Public/Card";
import PostImageGallery from "../PostImageGallery";
import PostDetailAgent from "./PostDetailAgent";
import PostDetailBody from "./PostDetailBody";
import SimilarPosts from "./SimilarPosts";

const PostDetail = ({ post, similarPosts }) => {
  const images = post.images.map((image) => ({
    original: image,
    thumbnail: image,
  }));

  const titleStatusPrefix =
    post.status === "active" ? "" : `(${getStatusLabelById(post.status)}) `;

  return (
    <div className="max-w-7xl m-auto p-2 ">
      <h1 className="text-2xl font-bold text-gray-harder py-6 break-words">
        {titleStatusPrefix}
        {post.title}
      </h1>

      <div className="mb-2">
        <Card>
          <PostImageGallery images={images} />
        </Card>
      </div>

      <div className="md:flex md:gap-x-2">
        {/* main content body */}
        <div className="md:w-2/3 border border-gray-50">
          {post && (
            <Card>
              <PostDetailBody
                post={post}
                postViews={post.stats.views.post}
                images={images}
              />
            </Card>
          )}
          {/* <pre>{JSON.stringify(post.createdBy, null, 2)}</pre> */}
        </div>

        {/* right sidebar */}
        <div className="md:w-1/3 border border-gray-50 h-full md:space-y-2">
          <Card>
            <PostDetailAgent postId={post._id} postOwner={post.createdBy} />
          </Card>

          <Card>
            <SimilarPosts similarPosts={similarPosts} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
