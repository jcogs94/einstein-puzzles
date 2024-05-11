import mongoose from 'mongoose'

const puzzleSchema = new mongoose.Schema({
    url: String,
    data: {
        name: String,
        difficulty: String,
        people: Array,
        categories: Object,
        clues: Array
    }
})

const sourceSchema = new mongoose.Schema({
    name: String,
    url: String,
    subUrl: String,
    puzzles: [puzzleSchema]
})

const Source = mongoose.model('Source', sourceSchema)
export default Source
