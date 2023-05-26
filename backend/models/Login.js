const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name:String,
    phone:Number,
    password:String,
    ear:Number,
    c_up:Number,
    m_up :Number
})

const User = mongoose.model('User', UserSchema)

module.exports = User