import { useMemo, useState, useEffect } from "react";
import PostFilter from "./PostFilter";
import PostItem from "./PostItem";
import { animateScroll, Element, scroller } from "react-scroll";
import { queryPostWithFilters } from "../../libs/post-utils";
import PostRow from "./PostRow";
import PostsByRegion from "./PostsByRegion";
import Modal from "../UI/Public/Modal";
import { ExclamationIcon } from "@heroicons/react/outline";
import { cleanObject } from "../../libs/object-utils";

const PostList = ({ posts, provinces, hasError }) => {
  const [searchCount, setSearchCount] = useState(0);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [localError, setLocalError] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(hasError);

  useEffect(() => {
    if (hasError || localError) {
      setShowErrorModal(true);
    }
  }, [hasError, localError]);

  const searchHandler = async (filters, onDone) => {
    try {
      const { postType } = filters;
      const cleanFilters = cleanObject({
        ...filters,
        postType: postType.searchFor,
      });
      const results = await queryPostWithFilters(cleanFilters);
      setFilteredPosts(results);
      setSearchCount((prevSearchCount) => prevSearchCount + 1);
      scroller.scrollTo("searchResult", {
        smooth: true,
      });
      onDone();
    } catch (error) {
      console.error("Failed to search posts:", error);
      setLocalError(true);
      onDone();
    }
  };

  const resetHandler = () => {
    setSearchCount(0);
    setLocalError(false);
    setShowErrorModal(false);
    animateScroll.scrollToTop({ duration: 500 });
  };

  const filteredPostList = useMemo(() => {
    return searchCount === 0 ? posts : filteredPosts;
  }, [searchCount, filteredPosts]);

  const listHeadingLabel = useMemo(() => {
    return searchCount > 0
      ? `ผลการค้นหา พบ (${filteredPosts.length}) รายการ`
      : "รายการประกาศล่าสุด";
  }, [searchCount, filteredPosts]);

  return (
    <div className="lg:max-w-7xl mx-auto">
      <h1 className="text-2xl font-extrabold tracking-tight text-gray-500 p-2 text-center">
        ลงประกาศอสังหาฟรี Propkub.com
      </h1>

      <PostFilter onSearch={searchHandler} onReset={resetHandler} />

      {/* ผลการค้นหา */}
      <div>
        <Element name="searchResult">
          <h2 className="text-xl font-extrabold tracking-tight text-gray-700 p-2">
            {listHeadingLabel}
          </h2>
        </Element>

        {/* 30 Recent posts with thumbnail */}
        <ul className="flex flex-wrap justify-between mb-10">
          {filteredPostList.slice(0, 30).map((post, index) => (
            <PostItem
              key={post._id}
              id={post._id}
              postType={post.postType}
              assetType={post.assetType}
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

        {/* Recent 31-50 posts without thumbnail */}
        <div className="overflow-hidden bg-white shadow sm:rounded-m">
          <ul role="list" className="divide-y divide-gray-200">
            {filteredPostList.slice(30, 50).map((post, index) => (
              <PostRow
                key={post._id}
                postType={post.postType}
                assetType={post.assetType}
                title={post.title}
                slug={post.slug}
                price={post.price}
                priceUnit={post.priceUnit}
                address={post.address}
                createdAt={post.createdAt}
              />
            ))}
          </ul>
        </div>

        <PostsByRegion
          regionId={"r1"}
          regionName="ภาคเหนือ"
          assetId={"land"}
          assetName={"ขายที่ดิน"}
          provinces={provinces.filter((p) => p.regionId === "r1")}
        />

        <PostsByRegion
          regionId={"r2"}
          regionName="ภาคกลาง"
          assetId={"land"}
          assetName={"ขายที่ดิน"}
          provinces={provinces.filter((p) => p.regionId === "r2")}
        />

        <PostsByRegion
          regionId={"r3"}
          regionName="ภาคตะวันออกเฉียงเหนือ"
          assetId={"land"}
          assetName={"ขายที่ดิน"}
          provinces={provinces.filter((p) => p.regionId === "r3")}
        />

        <PostsByRegion
          regionId={"r4"}
          regionName="ภาคตะวันตก"
          assetId={"land"}
          assetName={"ขายที่ดิน"}
          provinces={provinces.filter((p) => p.regionId === "r4")}
        />

        <PostsByRegion
          regionId={"r5"}
          regionName="ภาคตะวันออก"
          assetId={"land"}
          assetName={"ขายที่ดิน"}
          provinces={provinces.filter((p) => p.regionId === "r5")}
        />

        <PostsByRegion
          regionId={"r6"}
          regionName="ภาคใต้"
          assetId={"land"}
          assetName={"ขายที่ดิน"}
          provinces={provinces.filter((p) => p.regionId === "r6")}
        />
      </div>

      {/* Error Modal */}
      <Modal
        visible={showErrorModal}
        type="warning"
        title="เกิดข้อผิดพลาด"
        desc="ไม่สามารถโหลดข้อมูลประกาศได้ กรุณาลองใหม่อีกครั้ง"
        buttonCaption="ตกลง"
        Icon={ExclamationIcon}
        onClose={() => {
          setShowErrorModal(false);
          setLocalError(false);
        }}
      />
    </div>
  );
};

export default PostList;
