/**
 * @name pexel cat search
 * @desc Search for cat pics and return the image and results using mocha framework
 */

 // Require the Puppeteer module and the built-in assert module
const assert = require('assert')
const puppeteer = require('puppeteer')
const { toMatchImageSnapshot } = require('jest-image-snapshot');

let browser
let page

// In the Mocha "before" hook, create the browser and page objects.
before(async () => {
  browser = await puppeteer.launch()
  page = await browser.newPage()
})

//Suites
describe('Pexel cat-search', () => {

  it('has search input', async()=> {
    //set browser size for whole page
    await page.setViewport({ width:1640, height:800 })
    await page.goto('https://www.pexels.com', { waitUntil: 'networkidle0' })

    //assertion
    const searchInput = await page.$('input#search')
    assert.ok(searchInput)
  }).timeout(5000)  //5s timeout

  it('type cat in search bar', async()=>{
    //search for cat
    await page.type('input#search', 'cat')
    await page.click('button.rd__button#search-action', { waitUntil : 'networkidle0'})

    //make sure cat result is returned
    const h1Text = await page.$eval('h1', txt => txt.textContent.trim())
    const photoColumn = await page.waitForSelector('div.photos__column')
    assert.ok(photoColumn)
  }).timeout(5000)

  it('compare image', async()=>{
    const img = await page.screenshot({ path: 'pexel-cat.png', fullPage: false })
    //treshold for non-sensitive comparison
  }).timeout(5000)
})

//clean up
after(async () => {
  await browser.close()
})
