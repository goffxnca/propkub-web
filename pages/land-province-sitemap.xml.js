import { fetchProvinces } from "../libs/managers/addressManager";

function generateSiteMap(posts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${posts
       .map(({ id, name }) => {
         return `
       <url>
            <loc>https://propkub.com/land/spv${id}/ขายที่ดิน-${name}</loc>
            <priority>0.9</priority>
       </url>
     `;
       })
       .join("")}
   </urlset>
 `;
}

const LandProvinceSitemap = () => {};

export async function getServerSideProps({ res }) {
  console.log("LAND-PROVINCE-SITEMAP.XML.JS -> getServerSideProps EXECUTED");

  const provinces = await fetchProvinces();
  const sitemap = generateSiteMap(provinces);

  // Send the XML to the browser
  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default LandProvinceSitemap;
