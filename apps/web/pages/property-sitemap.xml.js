// NOTE: This implementation generates the property sitemap fresh on every request.
// For 5k+ posts, this can be inefficient and put heavy load on the API/DB,
// especially since multiple search engine bots (Google, Bing, etc.) may request the sitemap at unpredictable times.
// In the future, this should be improved with caching or Incremental Static Regeneration (ISR)
// to reduce backend load and serve a stale-but-recent sitemap (e.g., cache for 24h).
// For now, be aware that every request triggers a full fetch of all active posts.

import { getAllActivePostsForSitemap } from '../libs/post-utils';

function generateSiteMap(posts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${posts
       .map(({ slug, createdAt, updatedAt }) => {
         return `
       <url>
           <loc>${`https://propkub.com/property/${slug}`}</loc>
           <lastmod>${updatedAt || createdAt}</lastmod>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

const PropertySitemap = () => {};

export async function getServerSideProps({ res }) {
  const posts = await getAllActivePostsForSitemap();
  const sitemap = generateSiteMap(posts);

  // Send the XML to the browser
  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {}
  };
}

export default PropertySitemap;
