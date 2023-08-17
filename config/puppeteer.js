module.exports = {
  options: {
    headless: process.env.HEADLESS === "true",
    executablePath: process.env.CHROME_PATH,
    userDataDir: process.env.CHROME_USER_PROFILE,
    ignoreDefaultArgs: [
      "--disable-extensions",
      "--enable-automation",
      "--disable-blink-features=AutomationControlled",
      "--enable-blink-features=IdleDetection",
    ],
    // ignoreDefaultArgs: true,
    args: [
      // '--disable-gpu',
      // '--no-sandbox',
      // '--disable-setuid-sandbox',
      // '--disable-dev-shm-usage',
      // '--disable-popup-blocking',
      "--window-size=1920,1080",
      // '--no-first-run',
      // '--no-zygote',
      // "--no-default-browser-check",
      // "--ignore-certifcate-errors",
      // "--ignore-certifcate-errors-spki-list",
      // "--auto-open-devtools-for-tabs"
    ],
    defaultViewport: null,
    // slowMo: 10,
  },
};
