import Head from "next/head";
import Link from "next/link";
import PostItem from "../../components/Posts/PostItem";
import Breadcrumbs from "../../components/UI/Public/Breadcrumbs";
import { getLocationPrefix } from "../../libs/location-utils";
import {
  getAllProvincesByRegionId,
  fetchDistrictsByProvinceId,
  fetchSubDistrictsByDistrictId,
  getBreadcrumbs,
} from "../../libs/managers/addressManager";
import { getAllActivePostsByLocation } from "../../libs/post-utils";

import {
  genPropertyDescriptionMeta,
  genPropertyTitleMeta,
  getCanonicalUrl,
} from "../../libs/seo-utils";

const LandPostsByLocation = ({
  posts,
  locationCode,
  locationType,
  locationTypeName,
  locationName,
  provinceName,
  subLocations,
  isBangkok,
  breadcrumbs,
  currentUrl,
  title,
}) => {
  const relatedAreasTitle = `ประกาศ${locationTypeName}ในพื้นที่อื่นๆ ของ${getLocationPrefix(
    locationType,
    isBangkok
  )}${locationName}`;

  const metaDescription = genPropertyDescriptionMeta(
    `รวมประกาศ${title} ที่ลงประกาศโดยตรงจากเจ้าของทรัพย์และนายหน้าอสังหาริมทรัพย์`
  );

  return (
    <>
      <Head>
        <title>{genPropertyTitleMeta(title)}</title>
        <meta name="description" content={metaDescription} key="desc" />
        <link rel="canonical" href={getCanonicalUrl(currentUrl)} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={getCanonicalUrl(currentUrl)} />
      </Head>

      <div className="lg:max-w-7xl mx-auto">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="text-xl font-bold p-2">{title}</h1>
        {!posts.length && (
          <div className="text-xl mt-10 text-center">
            <span>--ยังไม่มีประกาศ{locationTypeName}ในพื้นที่นี้--</span>
          </div>
        )}
        <ul className="flex flex-wrap justify-between mb-10">
          {posts.slice(0, 30).map((post, index) => (
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

        <section className="mb-4">
          {locationType !== "sd" && (
            <h2 className="text-xl tracking-tight text-gray-900 p-2">
              {relatedAreasTitle}
            </h2>
          )}
          <ul className="flex w-full flex-wrap">
            {subLocations.map((subLocation) => (
              <li key={subLocation.id} className="mx-2">
                <Link
                  href={subLocation.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500"
                >
                  {subLocation.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
};

export async function getServerSideProps({ params, resolvedUrl }) {
  const [locationTypeAndCode, locationSlug] = params.slug;

  if (!(params.slug.length === 2 && locationTypeAndCode && locationSlug)) {
    return {
      notFound: true,
    };
  }

  const postType = locationTypeAndCode.substr(0, 1);
  console.log(postType);
  const locationType = locationTypeAndCode.substr(1, 2);
  const slugTexts = locationSlug.split("-");
  const locationName = slugTexts[1];
  const provinceName = slugTexts[slugTexts.length - 1];
  const locationTypeName = slugTexts[0];
  const locationCode = locationTypeAndCode.replace(
    locationTypeAndCode.substr(0, 3),
    ""
  );

  const isBangkok = provinceName === "กรุงเทพมหานคร";

  //Get all posts by current location
  const posts = await getAllActivePostsByLocation(
    "land",
    locationType,
    locationCode
  );

  //Get all other locations under some location
  const subLocations = await (
    locationCode.startsWith("p")
      ? getAllProvincesByRegionId(locationCode)
      : locationCode.startsWith("d")
      ? fetchDistrictsByProvinceId(locationCode)
      : fetchSubDistrictsByDistrictId(locationCode)
  );

  //Get breadcrumbs
  const breadcrumbList = await getBreadcrumbs(locationCode, locationType);

  const breadcrumbs = breadcrumbList.map((b, i) => ({
    ...b,
    href: `/land/${postType}${b.type}${
      b.id
    }/${locationTypeName}-${breadcrumbList
      .map((b) => b.name)
      .slice(0, i + 1)
      .reverse()
      .join("-")}`,
    current: b.type === locationType,
  }));

  return {
    props: {
      posts,
      locationCode,
      locationType,
      locationName,
      provinceName,
      subLocations: (subLocations || []).map((sub) => ({
        ...sub,
        href: `/land/${postType}${
          locationType === "pv" ? "dt" : locationType === "dt" ? "sd" : ""
        }${sub.id}/${locationTypeName}-${sub.name}${locationSlug.replace(
          locationTypeName,
          ""
        )}`,
      })),
      isBangkok,
      locationTypeName: locationTypeName,
      breadcrumbs,
      currentUrl: resolvedUrl,
      title: `${locationTypeName} ${breadcrumbList
        .map((b) => getLocationPrefix(b.type, isBangkok) + b.name)
        .reverse()
        .join(" ")}`,
    },
  };
}

export default LandPostsByLocation;
