// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

/** Sites that we won't visit and screenshot for... reasons */
const blockedSites = new Set(["https://xxx.com"]);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const url = req.query.url as string | undefined;
  if (!url) return res.status(400).end("Missing url parameter");
  if (blockedSites.has(url)) return res.status(400).end("Blocked site");

  const browser = await puppeteer.launch(
    process.env.AWS_EXECUTION_ENV
      ? {
          args: chromium.args,
          executablePath: await chromium.executablePath,
          headless: chromium.headless,
        }
      : {
          args: [],
          executablePath:
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        }
  );

  const page = await browser.newPage();
  await page.goto(url);
  await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });

  const img = await page.screenshot({ type: "png" });
  await browser.close();

  res.setHeader("Content-Type", "image/png");
  res.setHeader(
    "Cache-Control",
    "public, max-age=86400, stale-while-revalidate"
  );
  res.status(200).end(img);
};
