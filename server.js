import Fastify from "fastify";
import puppeteer from "puppeteer";
import { load } from "cheerio";
import path from "path";
import AutoLoad from "@fastify/autoload";

// Parse command line arguments
const port = process.argv[2] || 3000;

// Inside of Fastify object you can write configuration for app
const fastify = Fastify({
  logger: true, // Enable logger
});

// Register autoload plugin
fastify.register(AutoLoad, {
  dir: path.join(__dirname, "routes"),
  options: {},
});

// Register the route directly
fastify.post("/get-markdown", async function handler(request, reply) {
  try {
    const url = request.body.url;
    console.log("url", url);
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    await page.waitForSelector("body");

    const html = await page.content();
    const $ = load(html);
    let textContent = "";

    $("h1, h2, h3, p, li, span").each((i, elem) => {
      const text = $(elem).text().trim();
      if (text) {
        textContent += text + "\n";
      }
    });

    await browser.close();
    return { markdown: textContent.trim() };
  } catch (error) {
    return { status: 500, message: error.message };
  }
});

// Run web server
const start = async () => {
  try {
    await fastify.listen({ port });
    console.log(`Server is running on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
