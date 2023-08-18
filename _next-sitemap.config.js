/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://propkub.com",
  sitemapSize: 5000,
  // sitemapBaseFileName: "pk-sitemap",
  changefreq: "monthly",
  priority: 0.5,
  generateRobotsTxt: false,

  exclude: [
    "/account/*",
    "/agent/*",
    "/auth/*",
    "/condo/*",
    "/guides/*",
    "/404",
    "/about",
    "/blog",
    "/career",
    "/commercial",
    "/condominium",
    "/cool",
    "/createpost",
    "/dashboard",
    "/house",
    "/land",
    "/profile",
    "/test",
    "/townhome",
    "/trigger",
    "/xncamf",
  ],
  transform: async (config, path) => {
    const pathSitemapConfigs = [
      {
        path: "/login",
        config: { changefreq: "monthly", priority: "0.5" },
      },
      {
        path: "/signup",
        config: { changefreq: "monthly", priority: "0.5" },
      },
      {
        path: "/faq",
        config: { changefreq: "monthly", priority: "0.5" },
      },
      {
        path: "/contact",
        config: { changefreq: "monthly", priority: "0.5" },
      },
      {
        path: "/property/",
        config: { changefreq: "weekly", priority: "0.9" },
      },
      {
        path: "/",
        config: { changefreq: "daily", priority: "1" },
      },
    ];

    const targetConfig = pathSitemapConfigs.find((conf) =>
      path.startsWith(conf.path)
    );

    const sitemapLocation = {
      loc: path, // => this will be exported as http(s)://<config.siteUrl>/<path>
      changefreq: targetConfig?.config.changefreq || config.changefreq,
      priority: targetConfig?.config.priority || config.priority,
      // lastmod: config.autoLastmod ? new Date().toISOString() : undefined, //Drop for now if we dont have a reriable updated meanningful info about each urls especially on each property
      alternateRefs: config.alternateRefs ?? [],
    };

    if (path === "/") {
      sitemapLocation.lastmod = new Date().toISOString();
    }

    return sitemapLocation;
  },
};
