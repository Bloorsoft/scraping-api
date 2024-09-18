const puppeteer = require("puppeteer");
const { load } = require("cheerio");

module.exports = async function (fastify, opts) {
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
};
