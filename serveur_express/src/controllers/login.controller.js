const UserService = require('../services/user.service');
const User = require('../models/user');
const google_utils = require('../utils/google-utils');
const erreur = require('../utils/erreur');
const jwt = require('jsonwebtoken');

exports.checkToken = (req, res, next) => {
    try {
        // TODO Check if there is a token

        // TODO check if it should be refreshed

        return res.status(200).send("{\"redirectUrl\":\"" + google_utils.getConnectionUrl(google_utils.createConnection())+"\"}");

        if(req.headers.authorization === undefined){
            return res.status(400).send(new erreur("Missing header's authorization")).end()
        }

        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.GOOGLE_CLIENT_SECRET);
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            res.redirect(google_utils.getConnectionUrl(google_utils.createConnection()));
        } else {
            next();
        }
    } catch (err) {
        console.log(err);
    }
};

exports.getLogin = async (req, res, next) =>{
    const google_account = await google_utils.getGoogleEmailAndTokensFromCode(req.query.code);

    // We save the user's infos in database
    UserService.getUsersByGoogleEmail(google_account.email)
        .then(user=>{
            if(user !== null){
                user.token = google_account.tokens.access_token;
                user.refreshToken = google_account.tokens.refresh_token;
                UserService.updateUser(user._id, user);
            } else {
                // If the user doesn't exist, we create him in database
                UserService.addUser(google_account.email.split('@')[0], "no_need", google_account.tokens.access_token, google_account.tokens.refresh_token, google_account.email);
            }
        })
        .catch(err=>{
            console.log("mongoose err ", err);
        });

    return res.status(200).send(google_account.tokens);

    // TODO renvoyer au client

    // TODO renvoyer token
};

exports.postLogin = async (req, res, next) =>{
    // TODO : Il faut creer le token, se logger, etc
};

