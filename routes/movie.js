const router = require('express').Router();
const { tokenValidation, movieValidation } = require('../validate');
const Movie = require('../model/Movie');
const axios = require("axios");

router.get('/movies', async (req, res) => {
    var tokenValidate = tokenValidation(req.header('token'));
    if (!tokenValidate) return res.status(401).json({ error: true, message: 'Invalid Token' });

    const limit = parseInt(req.query.limit) || 6;
    const page = parseInt(req.query.page) || 1;

    const result = await Movie.paginate({}, { limit, page });
    res.json({ error: false, message: result });

})

router.get('/search', async (req, res) => {
    var tokenValidate = tokenValidation(req.header('token'));
    if (!tokenValidate) return res.status(401).json({ error: true, message: 'Invalid Token' });
    const searchKeyword = req.query.title;
    const result = await Movie.find({ title: { $regex: new RegExp(searchKeyword, 'i') } }).limit(5);
    res.json({ error: false, message: result });
})

router.get('/genre', async (req, res) => {
    var tokenValidate = tokenValidation(req.header('token'));
    if (!tokenValidate) return res.status(401).json({ error: true, message: 'Invalid Token' });
    const result = await Movie.distinct('genre');
    res.json({ error: false, message: result });
})

router.get('/details', async (req, res) => {
    var tokenValidate = tokenValidation(req.header('token'));
    if (!tokenValidate) return res.status(401).json({ error: true, message: 'Invalid Token' });
    try {
        var movieData, videoData;
        await axios.get("https://api.themoviedb.org/3/movie/" + req.query.movie_id + "?api_key=" + process.env.tmdbAPIKey)
            .then(response => { movieData = response.data })
            .catch(err => res.send(err));
        await axios.get("https://api.themoviedb.org/3/movie/" + req.query.movie_id + "/videos?api_key=6b2f0f2b8956c7b25c875a9e2461ab1a")
            .then(response => { videoData = response.data })
            .catch(err => res.send(err));
        var completeData = Object.assign({}, movieData, videoData);
        res.json(completeData)
    }
    catch (err) {
        res.status(401).json({ error: true, message: err });
    }

})

router.post('/movie', async (req, res) => {
    var tokenValidate = tokenValidation(req.header('token'));
    if (!tokenValidate) return res.status(401).json({ error: true, message: 'Invalid Token' });

    const { error } = movieValidation(req.body)
    if (error) return res.status(400).json({ error: true, message: error.details[0].message });

    const checkMovie = await Movie.findOne({ _id: req.body._id });
    if (checkMovie) return res.status(400).json({ error: true, message: 'Movie already exists' });

    const addMovie = new Movie({
        _id: req.body._id,
        title: req.body.title,
        synopsis: req.body.synopsis,
        genre: req.body.genre,
        productionYear: req.body.productionYear,
        poster: req.body.poster
    })
    try {
        const savedMovie = await addMovie.save();
        res.json({ movie: savedMovie._id });
    } catch (err) {
        res.status(400).send(err);
    }
})

module.exports = router;