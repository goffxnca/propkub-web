import { useMemo, useState } from "react";
import PostFilter from "./PostFilter";
import PostItem from "./PostItem";
import { animateScroll, Element, scroller } from "react-scroll";
import { queryPostWithFilters } from "../../libs/post-utils";
import PostRow from "./PostRow";
import PostsByRegion from "./PostsByRegion";

const PostList = ({ posts, provinces }) => {
  console.log("PostList");
  const [searchCount, setSearchCount] = useState(0);
  const [filteredPosts, setFilteredPosts] = useState([]);

  const searchHandler = async (filters, onDone) => {
    const {
      regionId,
      provinceId,
      districtId,
      subDistrictId,
      minPrice,
      maxPrice,
      keyword,
      postType,
      assetType,
      condition,
    } = filters;

    const results = await queryPostWithFilters(filters);
    debugger;
    console.log(results);

    // let results = posts;

    // results = results.filter((p) =>
    //   keyword ? JSON.stringify(p).indexOf(keyword) !== -1 : true
    // );

    // results = results.filter((p) =>
    //   postType.searchFor ? p.postType === postType.searchFor : true
    // );

    // results = results.filter((p) =>
    //   assetType ? p.assetType === assetType : true
    // );

    // results = results.filter((p) =>
    //   condition ? p.condition === condition : true
    // );

    // results = results.filter((p) =>
    //   subDistrictId
    //     ? p.address.subDistrictId === subDistrictId
    //     : districtId
    //     ? p.address.districtId === districtId
    //     : provinceId
    //     ? p.address.provinceId === provinceId
    //     : false
    // );

    // results = results.filter(
    //   (p) =>
    //     (minPrice > 0 ? p.price >= minPrice : true) &&
    //     (maxPrice > 0 ? p.price <= maxPrice : true)
    // );

    setFilteredPosts(results);
    setSearchCount((prevSearchCount) => prevSearchCount + 1);
    // animateScroll.scrollToBottom();
    scroller.scrollTo("searchResult", {
      smooth: true,
    });
    onDone();
  };

  const resetHandler = () => {
    setSearchCount(0);
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
      <h1 className="text-2xl font-extrabold tracking-tight text-gray-600 p-2 text-center hidden">
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

        {/* Recent 31-100 posts without thumbnai */}
        <div className="overflow-hidden bg-white shadow sm:rounded-m">
          <ul role="list" className="divide-y divide-gray-200">
            {filteredPostList.slice(30, 100).map((post, index) => (
              <PostRow
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
                createdAt={post.createdAt}
                createdBy={post.contact || post.createdBy}
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
    </div>
  );
};

export default PostList;
