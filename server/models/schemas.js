const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cardSchema = new Schema({
    name: {type:String, required:true},
    deck: {type:String, required:true},
    type: {type:String, required:true},
    color: {type: String, require:true},
    rarity: {type:String, required:true},
}, { collection : 'card'})
const Card = mongoose.model('Card', cardSchema, 'card')

const userSchema = new Schema({
    username: {type:String, required:true, unique:true},
    password: {type:String, required:true, minlength: 5},
    cardCollection: [
        {
            card: {type: mongoose.Schema.Types.ObjectId, ref: 'Card'}, 
            quantity: {type:Number, default: 0}
        }
    ],
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'Card'
        }
    ],
    entryDate: {type:Date, default:Date.now}
})
const Users = mongoose.model('Users', userSchema, 'users')

const mySchemas = {'Users':Users, 'Card':Card}
module.exports = mySchemas


