const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log('Database connected'));