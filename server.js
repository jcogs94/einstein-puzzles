import scrapePuzzle from './scrapers/scraper.js'
import express from 'express'
import fetch from 'node-fetch'
import Cheerio from 'cheerio'
const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))

const BASE_URL = 'https://www.brainzilla.com'
const ZEBRA_URL = 'https://www.brainzilla.com/logic/zebra/'
const seenUrls = {}
let puzzleUrls = []

const getUrl = (link) => {
    if (link.indexOf('http') !== -1) {
        return link
    } else {
        return `${BASE_URL}${link}`
    }
}

const crawl = async ({ url }) => {
    if (url === BASE_URL) {
        console.log('Starting to crawl...')
    } else if (seenUrls[url] || (url.indexOf(ZEBRA_URL) === -1) || (url.indexOf('pdf') !== -1) || (url.indexOf('answers') !== -1)) {
        return
    }
    
    console.log('crawling', url)
    seenUrls[url] = true
    
    const response = await fetch(url)
    const html = await response.text()
    const $ = Cheerio.load(html)
    const links = $('a').map((i, link) => link.attribs.href).get()

    for await (const link of links) {
        await crawl({
            url: getUrl(link)
        })
    }

    // links.forEach( async (link) => {
    // })

    if (url !== BASE_URL && url !== ZEBRA_URL && (url.indexOf('printable') === -1)) {
        puzzleUrls.push(url)
    }
}


// ================ ROUTES ============== //
app.get('/', async (req, res) => {
    await crawl({
        url: BASE_URL
    })

    console.log('success.... rendering page...')

    res.render('./index.ejs', {
        links: puzzleUrls
    })
})

app.get('/brainzilla', async (req, res) => {
    const puzzle = await scrapePuzzle(req.query.url)
    
    res.render('./brainzilla/index.ejs', {
        name: puzzle.name,
        people: puzzle.people,
        categories: puzzle.categories,
        categoryNames: Object.keys(puzzle.categories),
        clues: puzzle.clues
    })
})


// ================ SERVER ============== //
app.listen(3000, async () => {
    console.log('listening on port 3000')
})
