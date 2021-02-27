const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const movie = new mongoose.Schema({
    _id: {
        type: String
    },
    title: {
        type: String
    },
    synopsis: {
        type: String
    },
    genre: {
        type: String
    },
    productionYear: {
        type: String
    },
    poster: {
        type: String
    }
})

movie.plugin(mongoosePaginate)

module.exports = mongoose.model("Movie", movie);