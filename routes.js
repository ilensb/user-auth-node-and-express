const passport = require('passport');
const bcrypt = require('bcrypt');

module.exports = function (app, db) {
  
  //index route
        app.route('/')
          .get((req, res) => {
            let homePageObjects = {
              title: 'Home Page',
              message: 'Please login',
              showLogin: true,
              showRegistration: true
            };
            res.render(process.cwd() + '/views/pug/index.pug', homePageObjects);
        });
      
        //authenticate user
        let authenticateUser = passport.authenticate('local', {failureRedirect: "/"});

        //login route
        app.route("/login")
          .post(authenticateUser,(req, res) => {
            res.redirect("/profile");
        });
           
        //profile route
        app.route('/profile')
          .get(ensureAuthenticated, (req, res) => {
            let profilePageObject = {
              title: 'Profile Page',
              username: req.user.username
            };
            res.render(process.cwd() + '/views/pug/profile', profilePageObject);
        });
 
        //register
        app.route('/register')
          .post((req, res, next) => {
          
            var hash = bcrypt.hashSync(req.body.password, 12);
          
              db.collection('users').findOne({ username: req.body.username }, function (err, user) {
                  if(err) {
                      next(err);
                  } else if (user) {
                      res.redirect('/');
                  } else {
                      db.collection('users').insertOne(
                        {username: req.body.username,
                         password: hash},
                        (err, doc) => {
                            if(err) {
                                res.redirect('/');
                            } else {
                                next(null, user);
                            }
                        }
                      )
                  }
              })},
            //authenticate new user
            authenticateUser, (req, res, next) => {
                res.redirect('/profile');
            }
        );      
      
        //logout
        app.route('/logout')
          .get((req, res) => {
            req.logout();
            res.redirect('/');
        });
  
  
  //ENSURE authenticated middleware for /profile link
        function ensureAuthenticated(req, res, next) {
          if (req.isAuthenticated()) {
              return next();
          }
          res.redirect('/');
        };

}