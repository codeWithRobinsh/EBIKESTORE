const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const request = require("request");
var session = require('express-session')
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User = require("./models/user");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");
//mongoose.connect("mongodb://localhost/auth_demo");
mongoose.connect("mongodb+srv://ayanrobinsh:Test123%40@cluster0.nz4bm.mongodb.net/authdb", {
  useNewURLParser: true
});
app.use(require("express-session")({
secret: "ebike store",
resave: false,
saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//root
app.get("/", function (req, res) {
  res.render("index");
});

//register
app.get("/register", (req, res) => {
  res.render("register");
});
//register post route
app.post("/register",(req,res)=>{
    User.register(new User({username: req.body.username, email:req.body.email}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.render("register");
        }
    passport.authenticate("local")(req,res,function(){
        res.redirect("/success");
    })
    })
});

app.get("/success", (req, res) => {
  res.render("success");
});


//login
app.get("/login", (req, res) => {
  res.render("login");
});

//login post route
app.post("/login",passport.authenticate("local",{
    successRedirect:"/regdUser",
    failureRedirect:"/login"
}),function (req, res){
});
app.get("/regdUser",isLoggedIn ,(req,res) =>{
    res.render("regdUser");
});

//log out
app.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/");
});
function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


//index.html
app.get("/index.html", (req, res) => {
  res.redirect("/");
});


//send dir
app.get("/about.html", (req, res) => {
  res.sendFile(__dirname + "/" + "about.html");
});

app.get("/cart.html", (req, res) => {
  res.sendFile(__dirname + "/" + "cart.html");
});

app.get("/contact.html", (req, res) => {
  res.sendFile(__dirname + "/" + "contact.html");
});

app.get("/products.html", (req, res) => {
  res.sendFile(__dirname + "/" + "products.html");
});

//success - fail
app.get("/success.html", (req, res) => {
  res.sendFile(__dirname + "/" + "success.html");
});
app.get("/fail.html", (req, res) => {
  res.sendFile(__dirname + "/" + "fail.html");
});




//listen server
app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port 3000");
})
