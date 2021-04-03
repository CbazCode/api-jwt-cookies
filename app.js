const express = require('express');
const { dbConnection } = require('./database/config.js');
const cookieParser= require('cookie-parser');

const app = express();

dbConnection();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// routes
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', (req, res) => res.render('smoothies'));
app.use(require('./routes/authRoutes'));

app.listen(3000, ()=>console.log('Server on port 3000'));