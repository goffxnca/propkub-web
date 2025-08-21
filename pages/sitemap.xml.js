import { getLatestActivePostForSitemap } from '../libs/post-utils';

function generateSiteMap(lastModForPropertySitemap) {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <sitemap>
          <loc>https://propkub.com/main-sitemap.xml</loc>
           <lastmod>${lastModForPropertySitemap}</lastmod>
      </sitemap>
      <sitemap>
          <loc>https://propkub.com/property-sitemap.xml</loc>
          <lastmod>${lastModForPropertySitemap}</lastmod>
      </sitemap>
      <sitemap>
          <loc>https://propkub.com/land-province-sitemap.xml</loc>
      </sitemap>
  </sitemapindex>
 `;
}

const IndexSitemap = () => {
  // getServerSideProps will do the heavy lifting
};

export async function getServerSideProps({ res }) {
  console.log('SITEMAP.XML.JS -> getServerSideProps EXECUTED');

  const defaultDateTime = '2023-01-01T00:00:00Z';
  const latestActivePost = await getLatestActivePostForSitemap();

  const sitemap = generateSiteMap(
    latestActivePost
      ? latestActivePost?.updatedAt || latestActivePost?.createdAt
      : defaultDateTime
  );

  // Send the XML to the browser
  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {}
  };
}

export default IndexSitemap;
