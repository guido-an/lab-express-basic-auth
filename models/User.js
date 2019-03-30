const mongoose = require('mongoose')   // require Mongoose 
const Schema = mongoose.Schema        // Schema 

const userSchema = new Schema({
    username: String,
    password: String,
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema)

module.exports = User