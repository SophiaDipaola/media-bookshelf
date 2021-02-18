require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const session = require('express-session');
const passport = require('./config/ppConfig'); //
const flash = require('connect-flash');
const unirest = require('unirest');


const app = express();
app.set('view engine', 'ejs');

// Session 
const SECRET_SESSION = process.env.SECRET_SESSION;
const isLoggedIn = require('./middleware/isLoggedIn');

// MIDDLEWARE
app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);

// Session Middleware

// secret: What we actually will be giving the user on our site as a session cookie
// resave: Save the session even if it's modified, make this false
// saveUninitialized: If we have a new session, we save it, therefore making that true

const sessionObject = {
  secret: SECRET_SESSION,
  resave: false,
  saveUninitialized: true
}
app.use(session(sessionObject));
// Passport
app.use(passport.initialize()); // Initialize passport
app.use(passport.session()); // Add a session
// Flash 
app.use(flash());
app.use((req, res, next) => {
  console.log(res.locals);
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

// Controllers
app.use('/auth', require('./controllers/auth'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/profile', isLoggedIn, (req, res) => {
  const { id, name, email } = req.user.get();
  res.render('profile', { id, name, email });
});


// GET / - main index of site
// app.get('/', async (req, res) => {
//   try {
//     var listenNotesUrl = 'https://listen-api.listennotes.com/api/v2';
//     let response = await unirest.get('https://listen-api.listennotes.com/api/v2/search?q=star%20wars')
//       .header('X-ListenAPI-Key', 'c61dffbeb6c54d508b1f8b24caa1c986')
//     response = await response.toJSON();
//     let podcastResults = response.body.results;
//     console.log(podcastResults[0])
//     res.render('categories', {podcastResults})
//   } catch (e) {
//     console.log(e)
//   }
  //res.send(response);

  // Use request to call the API
  // axios.get('https://listen-api.listennotes.com/api/v2/search?q=star%20wars', {
  //   headers: {
  //     'X-ListenAPI-Key': 'c61dffbeb6c54d508b1f8b24caa1c986',
  //   }
  // }).then(function (apiResponse) {
  //   console.log(apiResponse)
  //   var podcast = apiResponse.data.results;
  //   res.render('index', { });
  // })
// });

// Imports all routes from the auth routes file
app.use('/auth', require('./controllers/auth'));
app.use('/categories', require('./controllers/categories'));


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${PORT} 🎧`);
});

module.exports = server;


