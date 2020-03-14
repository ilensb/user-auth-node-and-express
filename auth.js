const passport = require('passport');
const ObjectID = require('mongodb').ObjectID;
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local');

module.exports = function (app, db) {
  
  //serialization and app.listen
        //serialize id
        passport.serializeUser((user, done) => {
           done(null, user._id);
        });

        //deserialize without db
        passport.deserializeUser((id, done)=>{
          db.collection('users').findOne(
            {_id: new ObjectID(id)},
            (err, doc) => {
              done(null,doc);
            });
        });      
      
        //local strategy
        passport.use(new LocalStrategy(
          function(username, password, done) {
            db.collection('users').findOne({ username: username }, function (err, user) {
              console.log('User '+ username +' attempted to log in.');
              if (err) { return done(err); }
              if (!user) { return done(null, false); }
              if (!bcrypt.compareSync(password, user.password)) { return done(null, false); }
              return done(null, user);
            });
          }
        ));

}