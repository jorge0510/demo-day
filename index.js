const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const app = express();
const path = require('path');
const connectDB = require("./config/database");

//Use .env file in config folder
require("dotenv").config({ path: "./config/.env" });

//Connect To Database
connectDB();

//Set EJS as view render and view folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

//Use forms for put / delete
app.use(methodOverride("_method"));

//accept json on requests & Configure API Router
app.use(express.json())
const apiRouter = require('./routes/api')
const apiChatRouter = require('./routes/chat')
app.use('/api/businesses', apiRouter)
app.use('/api/chat', apiChatRouter)

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});