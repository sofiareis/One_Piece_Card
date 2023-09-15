const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cardSchema = new Schema({
    name: {type:String, required:true},
    deck: {type:String, required:true},
    type: {type:String, required:true},
    rarity: {type:String, required:true},
}, { collection : 'card'})
const Card = mongoose.model('Card', cardSchema, 'card')

const cardCollectionSchema = new Schema({
    cards: [{card: cardSchema, quantity: {type:String}}]
})
const CardCollection = mongoose.model('CardCollection', cardCollectionSchema, 'cardCollection')

const missingSchema = new Schema({
    cards: [cardSchema]
})
const Missing = mongoose.model('Missing', missingSchema, 'missing')


const wishingSchema = new Schema({
    cards: [cardSchema]
})
const Wishing = mongoose.model('Wishing', wishingSchema, 'wishing')

const userSchema = new Schema({
    name: {type:String, required:true},
    email: {type:String, required:true},
    cardCollection: {type: mongoose.Schema.Types.ObjectId, ref: 'CardCollection'},
    missing: {type: mongoose.Schema.Types.ObjectId, ref: 'Missing'},
    wishing: {type: mongoose.Schema.Types.ObjectId, ref: 'Wishing'},
    entryDate: {type:Date, default:Date.now}
})
const Users = mongoose.model('Users', userSchema, 'users')

const mySchemas = {'Users':Users, 'Card':Card, 'CardCollection':CardCollection, 'Missing':Missing, 'Wishing':Wishing}
module.exports = mySchemas


