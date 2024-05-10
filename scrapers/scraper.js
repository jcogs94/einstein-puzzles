import * as puppeteer from 'puppeteer'

const scrapePuzzle = async (url) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await  page.goto(url)

    // Scrapes data from the page and returns in obj
    let puzzle = await page.evaluate(() => ({
        people: Array.from(document.querySelectorAll('.title'), (el) => el.innerHTML),
        categories: Array.from(document.querySelectorAll('.container-columns:first-child > .column:first-child > ul > li'), (el) => el.innerHTML),
        clues: Array.from(document.querySelectorAll('.clues ul li'), (el) => el.textContent)
    }))

    await browser.close()
    return puzzle
}

const fullOutput = await scrapePuzzle('https://www.brainzilla.com/logic/zebra/fundraising-dinner/')
const desiredOutput = fullOutput.people

// console.log(fullOutput)
console.log(desiredOutput)

export default scrapePuzzle

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

// // Scrapes all categories from the page
// puzzle.categories = await page.evaluate(() =>
//     Array.from(document.querySelectorAll('.container-columns:first-child > .column:first-child > ul > li'), (el) => el.innerHTML)
// )

// // Scrapes all clues from the page
// puzzle.clues = await page.evaluate(() =>
//     Array.from(document.querySelectorAll('.clues ul li'), (el) => el.textContent)
// )
