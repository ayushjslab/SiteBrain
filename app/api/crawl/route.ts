import { NextRequest, NextResponse } from "next/server";
import { getUrlsFromSitemap, crawlPage } from "@/lib/crawl";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const siteUrl = searchParams.get("url");

    if (!siteUrl) {
      return NextResponse.json(
        { error: "Missing url query param" },
        { status: 400 }
      );
    }

    const urls = await getUrlsFromSitemap(siteUrl);
    const results = [];

    for (const url of urls) {
      const page = await crawlPage(url);
      if (page) results.push(page);
    }

    return NextResponse.json({
      total: results.length,
      pages: results,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Crawler failed" },
      { status: 500 }
    );
  }
}
