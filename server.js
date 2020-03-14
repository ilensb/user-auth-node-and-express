'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');

const routes = require('./routes.js');
const auth = require('./auth.js');

const session = require('express-session');
const passport = require('passport');
const mongo = require('mongodb').MongoClient;


const app = express();

app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//set up template engine
app.set('view engine', 'pug');

//encrpyt cookie
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
}));

//use passport init
app.use(passport.initialize());
//and passport session
app.use(passport.session());

//connect to db
mongo.connect(process.env.DATABASE, (err, db) => {
    if(err) {
        console.log('Database error: ' + err);
    } 
    else {
        console.log('Successful database connection');
      
      // instantiate imported auth
      auth(app, db);
      
       // instantiate imported routes
      routes(app, db);
      
      
      
        //middleware for pages not found
        app.use((req, res, next) => {
          res.status(404)
            .type('text')
            .send('Not Found');
        });

        app.listen(process.env.PORT || 3000, () => {
          console.log("Listening on port " + process.env.PORT);
        });
  }
});