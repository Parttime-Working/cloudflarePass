const puppeteerOpts = require('./puppeteer').options
const puppeteer = require('puppeteer-extra')
// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const price = {
  browser: null,
  page: null,
  // url: 'https://www.lme.com/en/Metals/Non-ferrous/LME-Aluminium#Trading+day+summary',
  url: 'https://verify.wickbot.com/',
  close: async () => {
    if (!price.browser) return true
    await price.browser.close().then(async () => {
      price.browser = null
      console.log(`Scrap finished for ${price.url}`)
    })
  },
  init: async () => {
    try {
      price.browser = await puppeteer.launch(puppeteerOpts)
      price.page = await price.browser.newPage()
      await price.page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 })

      await price.page.goto(price.url, { waitUntil: 'networkidle2' })

      const title = await price.page.title()
      console.log(title)

      const isReady = await new Promise((resolve) => {
        price.page
          .waitForSelector('session.ASP.NET_SessionId', { timeout: 30 * 1000 })
          .then(() => resolve(true))
          .catch(() => resolve(false))
      })

      if (!isReady) {
        // need human, maybe
        console.log("timeout...");
      };

      await price.getWebInfo()
    } catch (e) {
      console.error('[INIT] Failed', e)
    } finally {
      // await price.close()
    }

  },
  getWebInfo: async () => {
    try {
      const domains = await price.page.evaluate(() => {
        let domains = []
        for (let i = 0; i < document.getElementsByTagName('tbody')[0].children.length; i++) {
          domains.push({
            name: document.getElementsByTagName('tbody')[0].children[i].childNodes[0].innerText,
            status: document.getElementsByTagName('tbody')[0].children[i].childNodes[1].innerText,
            expires: document.getElementsByTagName('tbody')[0].children[i].childNodes[2].innerText,
            renewable: document.getElementsByTagName('tbody')[0].children[i].childNodes[3].innerText === 'Renewable',
            renewLink: document.getElementsByTagName('tbody')[0].children[i].childNodes[5].childNodes[0].href,
          })
        }

        return domains
      })

      const messages = await Promise.all(domains.map(async domain => {
        let message = ``
        const daysLeft = parseInt(domain.expires.replace(' Days', ''))
        message += `[${domain.name}] : **${daysLeft}** days left.\n${daysLeft < 14 ? 'Starting auto renewal.' : 'No need to renewal'}\n`

        if (daysLeft < 14) {
          await price.page.goto(domain.renewLink, { waitUntil: 'networkidle2' })
          await price.page.waitForSelector('.renewDomains')
          await price.page.evaluate(() => document.getElementsByTagName('option')[11].selected = true)
          await price.page.evaluate(() => document.getElementsByTagName('form')[0].submit())
          await price.page.waitForSelector('.completedOrder').catch(async () => {
            message += `**[${domain.name}]** An error has occurred while trying to auto renew this domain`
          })
          message += `**[${domain.name}]** Auto renewal complete !`
        }

        return message
      }))

    } catch (e) {
      console.error('[renew] Error', e)
    }
    await price.close()
  },
}

module.exports = price
