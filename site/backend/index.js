const express = require("express");
const app = express();
const passport = require("passport");
const passportSetup = require("./config/passport-setup");

const port = 4000;

app.use(passport.initialize());
// app.use(require('express-session')( { secret: 'keyboard cat', resave: true, saveUninitialized: true }));
// app.use(passport.session());

// GET website calls
app.get("/auth/discord", passport.authenticate("discord", { permissions: 8 }));
app.get("/auth/discord/callback", passport.authenticate('discord', {
    // If fails, return back to homepage
    failureRedirect: '/'
}), function(req, res) {
    // Success
    res.redirect("http://localhost:3000/");
});



app.listen(port, () => console.log('Server is running on port ' + port));
