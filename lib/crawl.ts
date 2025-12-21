import { parseStringPromise } from "xml2js";
import * as cheerio from "cheerio";

interface IUrls {
  loc: [""];
  lastmod: [""];
}
export async function getUrlsFromSitemap(sitemapUrl: string) {
  const res = await fetch(sitemapUrl, {
    method: "GET",
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch sitemap");
  }

  const xml = await res.text();
  const parsed = await parseStringPromise(xml);

  const urls = parsed.urlset.url.map((u: IUrls) => u.loc[0]);

  return urls;
}

export async function crawlPage(url: string) {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!res.ok) return null;

    const html = await res.text();
    const $ = cheerio.load(html);

    $(
      "script, style, nav, footer, aside, iframe, svg, canvas, noscript ,p, table, ol, li"
    ).remove();

    const text = $("body")
      .text()
      .replace(/\s+/g, " ")
      .trim();

    return {
      url,
      content: text,
    };
  } catch (err) {
    console.error("Failed:", url);
    return null;
  }
}
