const UserService = require('../services/user.service');
const google_utils = require('../utils/google-utils');
const axios = require('axios');

exports.checkToken = (req, res, next) => {
    try {
        if (req.headers.authorization === undefined) {
            return res.status(200).send("{\"redirectUrl\":\"" + google_utils.getConnectionUrl(google_utils.createConnection()) + "\"}");
        }

        const access_token = JSON.parse(req.headers.authorization).access_token;
        const refresh_token = JSON.parse(req.headers.authorization).access_token;

        axios.get("https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=" + access_token)
            .then(response => {
                if(response.data.expires_in === 0){
                    // If the token expired, the user must reconnect
                    return res.status(200).send("{\"redirectUrl\":\"" + google_utils.getConnectionUrl(google_utils.createConnection()) + "\"}");
                } else {
                    // If the token is valid, the middleware calls next so we can execute the requested api method
                    next();
                }
            })
            .catch(err => {
                return res.status(200).send("{\"redirectUrl\":\"" + google_utils.getConnectionUrl(google_utils.createConnection()) + "\"}");
            });
    } catch (err) {
        console.log(err);
    }
};

exports.getLogin = async (req, res, next) => {
    const google_account = await google_utils.getGoogleEmailAndTokensFromCode(req.query.code);

    // We save the user's infos in database
    UserService.getUsersByGoogleEmail(google_account.email)
        .then(user => {
            if (user !== null) {
                user.token = google_account.tokens.access_token;
                user.refreshToken = google_account.tokens.refresh_token;
                UserService.updateUser(user._id, user);
            } else {
                // If the user doesn't exist, we create him in database
                UserService.addUser(google_account.email.split('@')[0], "no_need", google_account.tokens.access_token, google_account.tokens.refresh_token, google_account.email);
            }
        })
        .catch(err => {
            console.log("mongoose err ", err);
        });

    return res.status(200).redirect("http://localhost:3000/completeAuthentication?tokens=" + JSON.stringify(google_account.tokens) + "&email=" + JSON.stringify(google_account.email));
};

exports.postLogin = async (req, res, next) => {
    // TODO : Il faut creer le token, se logger, etc
};

