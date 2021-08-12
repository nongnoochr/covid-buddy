// https://github.com/playwright-community/jest-playwright/#configuration
module.exports = {

  // // --- DO NOT parameterize browsers and devices when running playwright tests by default
  // browsers: ["chromium", "firefox", "webkit"],
  // exitOnPageError: false, // GitHub currently throws errors

  // // --- Find a list of devices below
  // // https://github.com/microsoft/playwright/blob/master/src/server/deviceDescriptorsSource.json

  // devices: [

  //   'Galaxy S8',
  //   // 'iPad Pro 11',
  //   'iPad Mini landscape',
  //   // 'iPhone 8',
  //   'iPhone 12',
  //   // 'Pixel 2 XL',
  //   'Pixel 5 landscape',
  //   // 'Desktop Safari',
  //   // 'Desktop Chrome',
  //   // 'Dekstop Edge',
  //   'Desktop Firefox',
  // ],
  // useDefaultBrowserType: true,

  // // --- For debugging
  // launchOptions: {
  //   slowMo: 250,
  //   headless: false,
  // },

  // -------------
  // Server needs to be started before running e2e tests
  // Cannot set this option in the test file
  // See https://github.com/playwright-community/jest-playwright/issues/446
  serverOptions: {
    command: 'node index.js',
    port: 8080,
    launchTimeout: 300000,
  }
};