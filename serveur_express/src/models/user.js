const mongoose = require('mongoose');

// WARNING - Will change with the oauth integration

const User = new mongoose.Schema({
    username: String,
    password: String,       // On ne stocke pas le mdp
    google_email: String,
    token: String,          // Pas encore sûr d'utiliser ça comme ça, il faut faire l'implémentation du oauth avant
    refreshToken: String,   // same ^
    created: Date
});

module.exports = mongoose.model("User", User);