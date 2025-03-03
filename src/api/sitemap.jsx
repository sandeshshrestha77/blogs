export default function handler(req, res) {
  const baseUrl = "https://blog.sandeshshrestha.xyz";

  const pages = ["/", "/blog"]; // Only Home and Blog page

  const urls = pages
    .map(
      (page) => `
    <url>
      <loc>${baseUrl}${page}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
  `
    )
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
  </urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.status(200).send(sitemap);
}
