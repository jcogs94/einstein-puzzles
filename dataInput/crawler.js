import fetch from 'node-fetch'
import Cheerio from 'cheerio'

let BASE_URL = ''
let SUB_URL = ''
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
    } else if (seenUrls[url] || (url.indexOf(SUB_URL) === -1) || (url.indexOf('pdf') !== -1) || (url.indexOf('answers') !== -1)) {
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

    if (url !== BASE_URL && url !== SUB_URL && (url.indexOf('printable') === -1)) {
        puzzleUrls.push(url)
    }
}

const startCrawling = async (baseUrl, subUrl) => {
    BASE_URL = baseUrl
    SUB_URL = subUrl
    
    await crawl({ url: BASE_URL })
    return puzzleUrls
}

export default startCrawling