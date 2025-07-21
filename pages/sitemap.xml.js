import { getLatestActivePostForSitemap } from "../libs/post-utils";

function generateSiteMap(lastModForPropertySitemap) {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <sitemap>
          <loc>https://propkub.com/main-sitemap.xml</loc>
           <lastmod>2025-08-01T00:00:00.00Z</lastmod>
      </sitemap>
      <sitemap>
          <loc>https://propkub.com/property-sitemap.xml</loc>
          <lastmod>${lastModForPropertySitemap}</lastmod>
      </sitemap>
      <sitemap>
          <loc>https://propkub.com/land-province-sitemap.xml</loc>
          <lastmod>2023-07-08T00:00:00.00Z</lastmod>
      </sitemap>
  </sitemapindex>
 `;
}

const IndexSitemap = () => {
  // getServerSideProps will do the heavy lifting
};

export async function getServerSideProps({ res }) {
  console.log("SITEMAP.XML.JS -> getServerSideProps EXECUTED");
  const latestActivePost = await getLatestActivePostForSitemap();
  const sitemap = generateSiteMap(latestActivePost.createdAt);
  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default IndexSitemap;
