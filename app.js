const express  = require('express');
const app = express();

require("dotenv").config();
const passport = require('./config/auth');
var jwt=require("jsonwebtoken");

const path = require('path');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const expressSession = require('express-session')

app.use(expressSession({
    secret: process.env.SESSION_SECRET_KEY,  
    resave: false,
    saveUninitialized: true,
}));

const mongooseConnection = require('./config/mongoose-connection');
const indexRouter = require('./routers/index_router');
const userModel = require('./models/user-model');

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.use(cookieParser());
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// Routes for Google OAuth
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  async function(req, res) {
    // Successful authentication, redirect home.
    // console.log(req.user);
    var user=await userModel.findOne({email:req.user.emails[0].value})
    console.log(user);
    
    let token = jwt.sign({email:user.email, id:user._id}, process.env.JWT);
    res.cookie("token",token);
   
    res.redirect('/profile'); 
  }
);

app.use('/', indexRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});