const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name : {
        type : 'string',
        required : true ,
        // trim = true
    },
    email : {
        type : 'string',
        required : true
    },
    password : {
        type : 'string',
        required : true
    },
    balance: Number,
    income: Number,
    expense: Number,
    transactions: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Transaction'
        }]
    }
})

const User = mongoose.model('User' , UserSchema)
module.exports = User