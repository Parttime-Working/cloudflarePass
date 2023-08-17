require("dotenv").config();

const puppeteerOpts = require("./config/puppeteer").options;
const puppeteer = require("puppeteer-extra");

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

// console.log(puppeteer, 'puppeteerpuppeteerpuppeteerpuppeteer')
puppeteer.use(StealthPlugin()); // this `;` is necessary

// IIFE last line no `;`
(async () => {
  let browser;
  let page;
  // const url = "https://verify.wickbot.com/";
  const url = "https://verify.wickbot.com/";

  try {
    browser = await puppeteer.launch(puppeteerOpts);
    const [page] = await browser.pages();
    await delay(2);

    // page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle2" });
    await page.setCookie({
      'name': 'cf_clearance',
      'value': 'M4uKuEVrIiGjv5iTCrOBYWXjKOncTSa5N2.4vSPfPEA-1692285554-0-1-88dce82e.2431c75c.dfddb7ce-160.2.1692285554',
    });
    await page.reload()

    await delay(5 * 60);
  } catch (e) {
    console.error("[INIT] Failed", e);
  } finally {
    await browser?.close().then(async () => {
      console.log(`Scrap finished for ${url}`);
    });
  }
})();

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time * 1000);
  });
}
