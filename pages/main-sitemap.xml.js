import { getLatestActivePostForSitemap } from '../libs/post-utils';

function generateSiteMap(lastModForPropertySitemap) {
  return `<?xml version="1.0" encoding="utf-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
          <loc>https://propkub.com</loc>
          <changefreq>daily</changefreq>
          <priority>1.0</priority>
          <lastmod>${lastModForPropertySitemap}</lastmod>
      </url>
      <url>
          <loc>https://propkub.com/login</loc>
          <changefreq>monthly</changefreq>
          <priority>0.3</priority>
          <lastmod>2023-01-01T00:00:00Z</lastmod>
      </url>
      <url>
          <loc>https://propkub.com/signup</loc>
          <changefreq>monthly</changefreq>
          <priority>0.3</priority>
          <lastmod>2023-01-01T00:00:00Z</lastmod>
      </url>
      <url>
          <loc>https://propkub.com/faq</loc>
          <changefreq>monthly</changefreq>
          <priority>0.5</priority>
          <lastmod>2023-01-01T00:00:00Z</lastmod>
      </url>
      <url>
          <loc>https://propkub.com/privacy-policy</loc>
          <changefreq>monthly</changefreq>
          <priority>0.5</priority>
          <lastmod>2023-01-01T00:00:00Z</lastmod>
      </url>
      <url>
          <loc>https://propkub.com/contact</loc>
          <changefreq>monthly</changefreq>
          <priority>0.5</priority>
          <lastmod>2023-01-01T00:00:00Z</lastmod>
      </url>					    
  </urlset>
 `;
}

const MainSitemap = () => {
  // getServerSideProps will do the heavy lifting
};

export async function getServerSideProps({ res }) {
  console.log('MAIN-SITEMAP.XML.JS -> getServerSideProps EXECUTED');

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

export default MainSitemap;
