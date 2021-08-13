// server needs to start before running this test
// % node index.js

// Needs to be higher than the default Playwright timeout
jest.setTimeout(40 * 1000)

const { chromium, firefox, webkit, devices } = require("playwright");

const deviceList = [
    'Galaxy S8',
    'iPad Mini landscape',
    'iPhone 12',
    'Pixel 2 XL',
    'Desktop Safari',
    'Desktop Chrome',
    'Dekstop Edge',
    'Desktop Firefox',
];

describe.each([
    [chromium.name(), chromium],
    [firefox.name(), firefox],
    [webkit.name(), webkit],
])('test on %p', (_browserName, browserType) => {

    let newBrowser;

    beforeAll(async () => {
        newBrowser = await browserType.launch();
        // // For debugging
        // newBrowser = await browserType.launch({
        //     // slowMo: 250,
        //     headless: false
        // });
    });

    afterAll(async () => {
        await newBrowser.close();
    });

    it.each(deviceList)('(#%s) should render the built app', async (curDeviceName) => {

        let context
        try {
            context = await newBrowser.newContext({
                ...devices[curDeviceName],

                // Required when clicking Submit
                geolocation: { longitude: 48.858455, latitude: 2.294474 },
                permissions: ['geolocation']
            });
        } catch (e) {
            console.log(`Skip test in "${_browserName}" `);
            return
        }

        const page = await context.newPage();
        await page.goto('http://localhost:8080');

        await expect(page).toHaveSelector('[data-testid="nav-item-brand"]');

        const selector = '[data-testid="nav-item-askbuddy"]';
        await page.click(selector);
        await expect(page).toHaveSelector('[data-testid="qna-container"]');

        const selectorResContainer = '[data-testid="response-container"]';
        const elResContainerBefore = await page.$(selectorResContainer);
        const elResContainerContentBefore = await elResContainerBefore.textContent();
        expect(elResContainerContentBefore).toBeFalsy();

        // await page.pause()

        // Click [placeholder="Select or type question or category..."]
        await page.click('[placeholder="Select or type question or category..."]');

        // Click text=What can we do so that other diseases like COVID-19 do not affect us in future?
        await page.click('#faq-typeahead-item-0');
        const element = await page.$('input[placeholder="Select or type question or category..."]');

        const elemValue = await element.inputValue();
        expect(elemValue).toBeTruthy();

        // Click text=Submit
        await page.click('text=Submit');

        // Poll until the response shows up
        await page.waitForSelector('[data-testid="response-item"]');

        const elResContainerAfter = await page.$(selectorResContainer);
        const elResContainerContentAfter = await elResContainerAfter.textContent();
        expect(elResContainerContentAfter).toBeTruthy();

        await page.close();
    });

});
