import * as puppeteer from 'puppeteer'

const scrapePuzzles = async () => {
    const URL = 'https://www.brainzilla.com/logic/zebra/wooden-furniture/'

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await  page.goto(URL)

    const el = await page.waitForSelector('xpath///*[@id="game"]')

    // // Scrape all html
    // const html = await page.content()
    // console.log(html)

    // // Scrape the title of the page
    // const title = await page.evaluate(() => document.title)
    // console.log(title)

    // // Scrapes all text from the page
    // const text = await page.evaluate(() => document.body.innerText)
    // console.log(text)

    // // Scrapes all links from the page
    // const links = await page.evaluate(() => Array.from(document.querySelectorAll('a'), (el) => el.href))
    // console.log(links)

    // Scrapes all clues from the page
    const clues = await page.evaluate(() =>
        Array.from(document.querySelectorAll('.clues ul li'), (el) => el.textContent)
    )

    await el.dispose()
    await browser.close()

    return clues
}

export default scrapePuzzles
