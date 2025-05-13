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

const featureRoutes = require('./routes/featureRequests');

const apiRouter = require('./routes/api')
const apiChatRouter = require('./routes/chat')
const authRoutes = require('./routes/auth');

const { ensureAuth } = require('./middleware/auth');

const Business = require('./models/Business');
const FAQ = require('./models/FAQ');



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





//Logging
app.use(logger("dev"));
//Use flash messages for errors, info, ect...
app.use(flash());


app.use('/featureRequests', featureRoutes);
app.use('/api/businesses', apiRouter)
app.use('/api/chat', apiChatRouter)
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.render('index', { user: req.user || null, messages: req.flash() });
});

app.get('/dashboard', ensureAuth, async (req, res) => {
  const user = req.user;
  const businesses = await Business.find({ 'claimedBy.userId': user._id }).lean();

  const selectedBusinessId = req.query.businessId || (businesses[0]?._id.toString());
  const selectedBusiness = await Business.findById(selectedBusinessId)
    .populate('claimedBy.userId')
    .lean();

  const faqs = await FAQ.find({ business: selectedBusiness?._id, hidden: { $ne: true } }).sort({ createdAt: -1 }).lean();

  if (selectedBusiness) selectedBusiness.faqs = faqs;

  res.render('dashboard', {
    user,
    businesses,
    selectedBusiness
  });
});

app.get('/about', (req, res) => {
  res.render('about', { user: req.user });
});

app.get('/developers', (req, res) => {
  res.render('developers', { user: req.user });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});