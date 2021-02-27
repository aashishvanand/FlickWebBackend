const mongoose = require('mongoose');

const user = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        min: 5
    },
    email: {
        type: String,
        require: true,
        max: 255
    },
    password: {
        type: String,
        require: true,
        min: 5
    }
})

module.exports = mongoose.model("User", user);