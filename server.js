import scrapePuzzle from './scrapers/scraper.js'
import express from 'express'
const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))


// ================ ROUTES ============== //
app.get('/', async (req, res) => {
    const puzzle = await scrapePuzzle('https://www.brainzilla.com/logic/zebra/blood-donation/')

    res.render('index.ejs', {
        name: puzzle.name,
        people: puzzle.people,
        categories: puzzle.categories,
        categoryNames: Object.keys(puzzle.categories),
        clues: puzzle.clues
    })
})


// ================ SERVER ============== //
app.listen(3000, () => {
    console.log('listening on port 3000')
})
