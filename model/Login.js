const { date } = require('joi');
const mongoose = require('mongoose');

const login = new mongoose.Schema({
    userID: {
        type: String,
        require: true
    },
    token: {
        type: String,
        require: true
    },
    loginTime: {
        type: Date,
        require: true
    }
})

module.exports = mongoose.model("Login", login);