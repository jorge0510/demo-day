const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const app = express();
const path = require('path');
const connectDB = require("./config/database");
require('./config/passport'); 

const flash = require("express-flash");
const logger = require("morgan");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const apiRouter = require('./routes/api')
const apiChatRouter = require('./routes/chat')
const authRoutes = require('./routes/auth');

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
app.use(express.urlencoded({ extended: true }));

// <--------------- Auth ----------------->
app.use(session({
  secret: 'keyboard cat', // or process.env.SESSION_SECRET
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


app.use('/api/businesses', apiRouter)
app.use('/api/chat', apiChatRouter)
app.use('/api/auth', authRoutes);


//Logging
app.use(logger("dev"));

//Use flash messages for errors, info, ect...
app.use(flash());

app.get('/', (req, res) => {
  res.render('index', {
    user: req.user || null,
    messages: req.flash()
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});