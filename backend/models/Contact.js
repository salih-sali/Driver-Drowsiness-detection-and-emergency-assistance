const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ContactSchema = new Schema({

   phone:Number,
   contact_relation:String,
   contact_name:String,
   contact_num :Number
})

const Contact = mongoose.model('Contact', ContactSchema)

module.exports = Contact