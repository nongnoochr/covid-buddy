/* eslint-disable no-undef */

// To run test:
// % yarn test -- -t tApp --verbose

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'


import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'

import App from '../App';

describe('tApp', () => {

  it('should render the home page by default', () => {

    const history = createMemoryHistory()
    render(
      <Router history={history}>
        <App />
      </Router>,
    )

    // NavBar
    expect(screen.queryByTestId('nav-item-askbuddy')).toBeInTheDocument();

    // Landing Page
    expect(screen.getByText('COVID-19 Buddy: Your Trustworthy Assistant')).toBeInTheDocument()

    // GitHub
    expect(screen.queryByTestId('github-container')).toBeInTheDocument();

  });

  it('click "Ask Buddy" in navbar should navigate to the Buddy view',
    async () => {
      const history = createMemoryHistory()
      render(
        <Router history={history}>
          <App />
        </Router>,
      );

      const elNavAskBuddy = await screen.findByTestId('nav-item-askbuddy');
      userEvent.click(elNavAskBuddy);

      // Location should be updated
      expect(history.location.pathname).toEqual('/askbuddy');

      // View should be updated to the Ask Buddy mode
      expect(screen.queryByTestId('qna-container')).toBeInTheDocument();
    });
});

// -----------
// Examples of UI interaction tests with puppeteer in jest:
// https://blog.logrocket.com/react-end-to-end-testing-jest-puppeteer/

// import puppeteer from "puppeteer";
// jest.setTimeout(100000);

// describe('tApp', () => {

//   // https://itnext.io/how-not-to-despair-while-setting-up-puppeteer-and-jest-on-a-create-react-app-plus-ci-on-travis-b25f387ee00f
//   // https://blog.logrocket.com/react-end-to-end-testing-jest-puppeteer/

//   let browser;
//   let page;

//   beforeAll(async () => {
//     browser = await puppeteer.launch({
//       // headless: false,
//       // devtools: true,
//       // slowMo: 250, // slow down by 250ms
//     });
//   });

//   beforeEach(async () => {
//     page = await browser.newPage();

//     // % yarn start
//     // must be run before this line
//     await page.goto('http://localhost:3000');
//   });

//   afterEach(async () => await page.close());

//   afterAll(async () => await browser.close());

//   it('should be loaded properly',
//     async () => {

//       // https://developers.google.com/web/tools/puppeteer/debugging

//       await expect(page.title()).resolves.toMatch('COVID-19 Buddy');

//       // await page.evaluate(() => {
//       //   debugger;
//       // });

//     }
//   );

//   it('click "Ask Buddy" in navbar',
//     async () => {

//       const selector = '[data-testid="nav-item-askbuddy"]';
//       await page.waitForSelector(selector);

//       await page.click(selector);
//       const domQNAContainer = await page.$$('[data-testid="qna-container"]');
//       expect(domQNAContainer.length).toBe(1);

//     });
// });