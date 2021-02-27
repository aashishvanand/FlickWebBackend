const express = require('express');
var cors = require('cors');
var db = require('./db');
const app = express();

// middleware
app.use(cors())
app.use(express.json());

// routes
const authRoute = require('./routes/auth');
const movieRoute = require('./routes/movie');

app.use('/v1/auth', authRoute);
app.use('/v1/movie', movieRoute);

app.listen(3001, function () {
  console.log('server listening on 3001')
})