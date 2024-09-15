const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
var userModel = require('../models/user-model');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback" 
  },
  async function(accessToken, refreshToken, profile, done) {
    // Here you would find or create a user in your database
    // For example:
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
    let user = await userModel.findOne({ email: profile.emails[0].value });
    if(!user){
        user=await userModel.create({
            username:profile.displayName,
            name:profile.name.givenName,
            email:profile.emails[0].value,
            profilePicture:profile.photos[0].value,
            hisaab:[]
        })
    }
   

    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

module.exports = passport;