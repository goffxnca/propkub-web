import { getAllActivePostsForSitemap } from "../libs/post-utils";

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
       .join("")}
   </urlset>
 `;
}

const PropertySitemap = () => {};

export async function getServerSideProps({ res }) {
  console.log("PROPERTY-SITEMAP.XML.JS -> getServerSideProps EXECUTED");

  const posts = await getAllActivePostsForSitemap();
  const sitemap = generateSiteMap(posts);

  // Send the XML to the browser
  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default PropertySitemap;
