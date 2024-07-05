if(process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const express = require('express');

const cookieParser = require('cookie-parser');

const session = require('express-session');

const flash = require('connect-flash');

const authRoute = require('./routes/auth');

const userRoute = require('./routes/user');

const path = require('path');

const app = express();

app.set("view engine", "ejs");

app.set("views", "views");

app.enable("trust proxy");

app.use(cookieParser());

app.use(session({
  secret: 'jefjwegj@!*&%^*%(1234#',
  resave: false,
  proxy: true,
  saveUninitialized: true,
  cookie: { secure: true, sameSite: "none", httpOnly: true },
}));

app.use((req, res, next) => {
  req.session.lang = req.session.lang || req.cookies.lang || 'fr';
  req.session.isLoggedIn = req.cookies.isLoggedIn || req.session.isLoggedIn || 'false';
  // console.log(req.session.isLoggedIn);
  next();
});

app.use(flash());

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(authRoute);

app.use("/v1", userRoute);

app.listen(4000, () => {
  console.log("Listening to localhost PORT 4000...");
})