/**
* @name pexel cat search
* @desc Search for cat pics and return the image and results using jest framework
*/

// Require the Puppeteer module and the built-in assert module
const assert = require('assert')
const puppeteer = require('puppeteer')
const pixelmatch = require('pixelmatch')
const { toMatchImageSnapshot } = require('jest-image-snapshot');    //snapshot saver
const { PendingXHR } = require('pending-xhr-puppeteer');  //wait for ajax req

expect.extend({ toMatchImageSnapshot });

let browser
let page
let pendingXHR

// In the Mocha "before" hook, create the browser and page objects.
beforeAll(async () => {
  browser = await puppeteer.launch()
  page = await browser.newPage()
  pendingXHR = new PendingXHR(page);
})

//Suites
describe('Pexel cat-search', () => {
  it('has search input', async()=> {
    //set browser size for whole page
    await page.setViewport({ width:1640, height:800 })
    await page.goto('https://www.pexels.com', { waitUntil: 'networkidle2', timeout: 10000 })  //considered done if no more than 2 network connections for ~10s

    //assertion
    const searchInput = await page.$('input#search')
    assert.ok(searchInput)
  }, 10000)  //5s timeout

  it('type cat in search bar', async()=>{
    //search for cat
    await page.type('input#search', 'cat')
    await page.click('button.rd__button#search-action', {waitUntil : 'networkidle2', timeout: 10000})
    await pendingXHR.waitForAllXhrFinished()

    //make sure cat result is returned
    const h1Text = await page.$eval('h1', txt => txt.textContent.trim())
    const photoColumn = await page.waitForSelector('div.photos__column')
    assert.ok(photoColumn)
  }, 10000)

  it('compare image', async()=>{
    // await page.setViewport({ width:1640, height:800 }, {waitUntil: 'networkidle2', timeout: 10000})
    const img = await page.screenshot({ path: 'screenshot/cat_' + new Date().getTime() + '.png', fullPage: false })
    //treshold for non-sensitive comparison
    expect(img).toMatchImageSnapshot({ treshold: 1 })
  }, 10000)
})


//clean up
afterAll(async () => {
  await browser.close()
})
