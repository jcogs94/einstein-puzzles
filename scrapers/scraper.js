import * as puppeteer from 'puppeteer'

const scrapePuzzle = async (url) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await  page.goto(url)

    // Scrapes data from the page and returns in obj
    let puzzle = await page.evaluate(() => ({
        name: Array.from(document.querySelectorAll('.page-header > h1'), (el) => el.textContent),
        people: Array.from(document.querySelectorAll('.title'), (el) => el.innerHTML),
        options: Array.from(document.querySelectorAll('.house > li > select > option'), (el) => el.innerHTML),
        categories: Array.from(document.querySelectorAll('.container-columns:first-child > .column:first-child > ul > li'), (el) => el.innerHTML),
        clues: Array.from(document.querySelectorAll('.clues ul li'), (el) => el.textContent)
    }))

    await browser.close()

    // Converts puzzle.name from arr to str and removes branding
    puzzle.name = puzzle.name[0]
    puzzle.name = puzzle.name.replace(' Zebra Puzzle', '')

    // Removes duplicates from the select options
    puzzle.options = puzzle.options.filter((item, index) =>
        puzzle.options.indexOf(item) === index)
    
    // Removes '' value
    puzzle.options = puzzle.options.slice(1)

    // Separates all entries in array into separate arrays within
    // their catergories
    let tempArr = []
    while (puzzle.options.length > 0) {
        tempArr.push(puzzle.options.splice(0, puzzle.people.length))
    }
    puzzle.options = tempArr

    // Creates a new object with key pairs of the category name and
    // its respective options
    let newCategoriesObj = {}
    for(let i = 0; i < puzzle.people.length; i++) {
        newCategoriesObj[puzzle.categories[i]] = puzzle.options[i]
    }
    puzzle.categories = newCategoriesObj
    delete puzzle.options

    return puzzle
}

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
