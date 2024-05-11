import mongoose from 'mongoose'

const savedURLsSchema = new mongoose.Schema({
    URLs: Array
})

const SavedURLs = mongoose.model('SavedURLs', savedURLsSchema)
export default SavedURLs
