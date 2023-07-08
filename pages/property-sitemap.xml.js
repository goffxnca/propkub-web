import { getAllActivePostsForSitemap } from "../libs/post-utils";

const EXTERNAL_DATA_URL = "https://propkub.com/property";

function generateSiteMap(posts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${posts
       .map(({ slug, createdAt }) => {
         return `
       <url>
           <loc>${`${EXTERNAL_DATA_URL}/${slug}`}</loc>
           <lastmod>${createdAt}</lastmod>
       </url>
     `;
       })
       .join("")}
   </urlset>
 `;
}

const PropertySitemap = () => {
  // getServerSideProps will do the heavy lifting
};

export async function getServerSideProps({ res }) {
  console.log("PROPERTY-SITEMAP.XML.JS -> getServerSideProps EXECUTED");
  const posts = await getAllActivePostsForSitemap();
  const sitemap = generateSiteMap(posts);

  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default PropertySitemap;
