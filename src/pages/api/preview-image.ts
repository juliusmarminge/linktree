// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
import { previewImageParams } from "~/utils/zod-params";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.url?.startsWith("http")) req.url = `http://yoyo.com${req.url}`;
  const parsed = previewImageParams.decodeRequest(req);
  if (!parsed.success) return res.status(400).json(parsed.error);
  const props = parsed.data.input;

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
  await page.goto(props.url);
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
