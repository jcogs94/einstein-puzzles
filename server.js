import scrapePuzzle from './scrapers/scraper.js'
import express from 'express'
const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))


// ================ ROUTES ============== //
app.get('/', async (req, res) => {
    res.render('index.ejs', {
        puzzle: await scrapePuzzle('https://www.brainzilla.com/logic/zebra/fundraising-dinner/')
    })
})


// ================ SERVER ============== //
app.listen(3000, () => {
    console.log('listening on port 3000')
})
