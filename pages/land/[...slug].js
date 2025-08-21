import Head from 'next/head';
import Link from 'next/link';
import PostItem from '../../components/Posts/PostItem';
import Breadcrumbs from '../../components/UI/Public/Breadcrumbs';
import { getLocationPrefix } from '../../libs/location-utils';
import {
  fetchDistrictsByProvinceId,
  fetchSubDistrictsByDistrictId,
  getLocationBreadcrumbs
} from '../../libs/managers/addressManager';
import { getAllActivePostsByLocation } from '../../libs/post-utils';

import {
  genPropertyDescriptionMeta,
  genPropertyTitleMeta,
  getCanonicalUrl
} from '../../libs/seo-utils';

const LandPostsByLocationPage = ({
  posts,
  locationType,
  assetTypeAndPurpose,
  locationName, // Ex. ภูเก็ต, คลองสามวา, บ่อวิน
  subLocations,
  isBangkok,
  breadcrumbs,
  currentUrl,
  title
}) => {
  const relatedAreasTitle = `ประกาศ${assetTypeAndPurpose}ในพื้นที่อื่นๆ ของ${getLocationPrefix(
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
            <span>--ยังไม่มีประกาศ{assetTypeAndPurpose}ในพื้นที่นี้--</span>
          </div>
        )}
        <ul className="flex flex-wrap justify-between mb-10">
          {posts.slice(0, 30).map((post, index) => (
            <PostItem
              key={post._id}
              id={post._id}
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
          {locationType !== 'sd' && (
            <h2 className="text-xl tracking-tight text-gray-900 p-2">
              {relatedAreasTitle}
            </h2>
          )}
          <ul className="flex w-full flex-wrap">
            {subLocations.map((subLocation) => (
              <li key={subLocation.id} className="mx-2">
                <Link
                  href={subLocation.href}
                  // target="_blank"
                  // rel="noopener noreferrer"
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

// Traditional SSR, fetch fresh data on every request
export async function getServerSideProps({ params, resolvedUrl }) {
  // Ex. full url -> /land/ssds104603/ขายที่ดิน-บางชัน-คลองสามวา-กรุงเทพมหานคร
  const [locationTypeAndCode, locationTHSlug] = params.slug; // [ssds104603, ขายที่ดิน-บางชัน-คลองสามวา-กรุงเทพมหานคร]

  if (!(params.slug.length === 2 && locationTypeAndCode && locationTHSlug)) {
    // Expect 2 url segments
    return {
      notFound: true
    };
  }

  const landIdPrefix = locationTypeAndCode.substr(0, 1); // s
  if (landIdPrefix !== 's') {
    return {
      notFound: true
    };
  }

  const locationType = locationTypeAndCode.substr(1, 2); // sd
  if (locationType.length !== 2 || !['pv', 'dt', 'sd'].includes(locationType)) {
    return {
      notFound: true
    };
  }

  const slugTexts = locationTHSlug.split('-'); // [ 'ขายที่ดิน', 'บางชัน', 'คลองสามวา', 'กรุงเทพมหานคร' ]
  if (slugTexts.length < 2 || slugTexts.length > 4) {
    return {
      notFound: true
    };
  }

  const locationName = slugTexts[1]; // The most specific location name -> 'บางชัน'
  const assetTypeAndPurpose = slugTexts[0]; // ขายที่ดิน
  if (assetTypeAndPurpose !== 'ขายที่ดิน') {
    return {
      notFound: true
    };
  }

  const locationId = locationTypeAndCode.replace(
    locationTypeAndCode.substr(0, 3),
    ''
  ); // s104603

  // Get all posts by current location
  const posts = await getAllActivePostsByLocation({
    assetType: 'land',
    postType: 'sale',
    locationType,
    locationId
  });

  // Get all other sub-locations
  const subLocations = await (locationId.startsWith('p')
    ? fetchDistrictsByProvinceId(locationId)
    : locationId.startsWith('d')
      ? fetchSubDistrictsByDistrictId(locationId)
      : Promise.resolve([]));

  // Get all location breadcrumbs
  const breadcrumbs = await getLocationBreadcrumbs(locationId, locationType);
  const isBangkok = breadcrumbs[0]?.name === 'กรุงเทพมหานคร';

  return {
    props: {
      posts,
      title: `${assetTypeAndPurpose} ${breadcrumbs
        .map((b) => getLocationPrefix(b.type, isBangkok) + b.name)
        .reverse()
        .join(' ')}`,
      locationType,
      assetTypeAndPurpose,
      locationName,
      isBangkok,
      currentUrl: resolvedUrl,
      breadcrumbs: breadcrumbs.map((b, i) => ({
        ...b,
        href: `/land/${landIdPrefix}${b.type}${b.id}/${assetTypeAndPurpose}-${breadcrumbs
          .map((b) => b.name)
          .slice(0, i + 1)
          .reverse()
          .join('-')}`,
        current: b.type === locationType
      })),
      subLocations: (subLocations || []).map((sub) => ({
        ...sub,
        href: `/land/${landIdPrefix}${
          locationType === 'pv' ? 'dt' : locationType === 'dt' ? 'sd' : ''
        }${sub.id}/${assetTypeAndPurpose}-${sub.name}${locationTHSlug.replace(
          assetTypeAndPurpose,
          ''
        )}` // /land/sdtd1102/ขายที่ดิน-บางบ่อ-สมุทรปราการ
      }))
    }
  };
}

export default LandPostsByLocationPage;
