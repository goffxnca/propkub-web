import { useEffect } from "react";
import Heading from "../../UI/Public/Heading";
import SimilarPostItem from "./SimilarPostItem";

const SimilarPosts = ({ similarPosts }) => {
  useEffect(() => {
    console.log("SimilarPosts");
  }, []);

  return (
    <>
      <div className="">
        <Heading size="2" label="ประกาศที่คล้ายกัน" />
        <div>
          <ul className="flex flex-wrap">
            {similarPosts.map((post) => (
              // <div className="bg-red-200 w-full">Hey</div>
              <SimilarPostItem
                key={post.id}
                id={post.id}
                postType={post.postType}
                assetType={post.assetType}
                condition={post.condition}
                title={post.title}
                slug={post.slug}
                thumbnail={post.thumbnail}
                thumbnailAlt={post.thumbnailAlt}
                price={post.price}
                priceUnit={post.priceUnit}
                address={post.address}
                specs={post.specs}
                isStudio={post.isStudio}
              />
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default SimilarPosts;
