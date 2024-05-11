import dotenv from 'dotenv'
import scrapePuzzle from './dataInput/scraper.js'
import startCrawling from './dataInput/crawler.js'
import express from 'express'
import mongoose from 'mongoose'
import Source from './models/puzzle.js'
import SavedURLs from './models/savedURLs.js'

const app = express()
dotenv.config()

mongoose.connect(process.env.MONGODB_URI)

app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))


// ================ ROUTES ============== //
app.get('/', async (req, res) => {
    const foundSources = await Source.find()
    
    res.render('./index.ejs', {
        sources: foundSources
    })
})

app.post('/sources/new', async (req, res) => {
    let newSource = (req.body)
    
    if (newSource.crawl === 'true') {
        newSource.crawl = true
    } else if (newSource.crawl === 'false') {
        newSource.crawl = false
    }

    await Source.create(newSource)
    res.redirect('/')
})

app.post('/sources/update', async (req, res) => {
    const foundSources = await Source.find()
    let savedURLs = await SavedURLs.findById('663fc8777ef2e6d873c9cc6f')
    savedURLs = [...savedURLs.URLs]

    console.log('savedURLs:', savedURLs)
    
    let newPuzzleUrls = []

    for await (const source of foundSources) {
        const puzzleUrls = await startCrawling(source.url, source.subUrl)
        puzzleUrls.forEach( (url) => {
            if (savedURLs.indexOf(url) === -1) {
                newPuzzleUrls.push(url)
            }
        })
    }

    for await (let puzzleUrl of newPuzzleUrls) {
        await scrapePuzzle(puzzleUrl)
    }
    
    res.redirect('/')
})

app.get('/puzzles/:sourceId/:puzzleId', async (req, res) => {
    const allFoundSources = await Source.find()

    let foundSource
    let puzzle

    allFoundSources.forEach( (source) => {
        if (source._id == req.params.sourceId) {
            foundSource = source
        }
    })
    

    foundSource.puzzles.forEach( (foundPuzzle) => {
        if (foundPuzzle._id == req.params.puzzleId) {
            puzzle = foundPuzzle.data
        }
    })

    res.render('./puzzle/show.ejs', {
        name: puzzle.name,
        difficulty: puzzle.difficulty,
        people: puzzle.people,
        categories: puzzle.categories,
        categoryNames: Object.keys(puzzle.categories),
        clues: puzzle.clues
    })
})


// ================ SERVER ============== //
mongoose.connection.on('connected', () => {
    console.log('Connected to database...')
})

app.listen(3009, async () => {
    console.log('listening on port 3009')
})
