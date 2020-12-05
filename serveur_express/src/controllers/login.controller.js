const UserService = require('../services/user.service');
const DashboardService = require('../services/dashboard.service');
const SoldeService = require('../services/solde.service');
const google_utils = require('../utils/google-utils');
const axios = require('axios');

/**
 * This method is called at every request made on the API.
 * Its role is to check that the request includes a valid token before forwarding the request.
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.checkToken = (req, res, next) => {
    try {
        // We start by checking that the request has an autorization header
        if (req.headers.authorization === undefined) {
            return res.status(401).send("{\"redirectUrl\":\"" + google_utils.getConnectionUrl(google_utils.createConnection()) + "\"}");
        }

        // We then parse the tokens from the request's header
        const access_token = req.headers.authorization.substring(7, req.headers.authorization.length);
        // const refresh_token = JSON.parse(req.headers.authorization).refresh_token;

        // And finally we use the google api to check that the given token is correct
        axios.get("https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=" + access_token)
            .then(response => {
                if(response.data.expires_in === 0){
                    // If the token expired, the user must reconnect
                    return res.status(401).send("{\"redirectUrl\":\"" + google_utils.getConnectionUrl(google_utils.createConnection()) + "\"}");
                } else {
                    // If the token is valid, the middleware calls next so we can execute the requested api method
                    next();
                }
            })
            .catch(err => {
                return res.status(401).send("{\"redirectUrl\":\"" + google_utils.getConnectionUrl(google_utils.createConnection()) + "\"}");
            });
    } catch (err) {
        console.log(err);
    }
};

/**
 * This method is called when the user was redirect after logging in using the google page.
 * It creates/updates the user in database and redirects the user to the react server.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void|*|Response>}
 */
exports.getLogin = async (req, res, next) => {
    await google_utils.getGoogleEmailAndTokensFromCode(req.query.code)
        .then(google_account => {
            // We save the user's infos in database
            UserService.getUsersByGoogleEmail(google_account.email)
                .then(user => {
                    if (user !== null) {
                        user.token = google_account.tokens.access_token;
                        user.refreshToken = google_account.tokens.refresh_token;
                        UserService.updateUser(user._id, user);
                        return res.status(200).redirect(process.env.REACT_SERVER_ROUTE + "/completeAuthentication?tokens=" + JSON.stringify(google_account.tokens) + "&email=" + JSON.stringify(google_account.email) + "&userid=" + user._id);
                    } else {
                        // If the user doesn't exist, we create him in database
                        UserService.addUser(google_account.email.split('@')[0], "no_need", google_account.tokens.access_token, google_account.tokens.refresh_token, google_account.email)
                            .then(createdUser => {
                                DashboardService.getDashboard(process.env.MONGODB_DASHBOARD_ID)
                                    .then(dashboard => {
                                        const new_user_list = dashboard.users;
                                        if(!new_user_list.includes(createdUser._id)) {
                                            new_user_list.push(createdUser._id);
                                        }
                                        DashboardService.updateDashboard(process.env.MONGODB_DASHBOARD_ID, {users: new_user_list});
                                        SoldeService.addSolde(process.env.MONGODB_DASHBOARD_ID, createdUser._id, 0);
                                        return res.status(200).redirect(process.env.REACT_SERVER_ROUTE + "/completeAuthentication?tokens=" + JSON.stringify(google_account.tokens) + "&email=" + JSON.stringify(google_account.email) + "&userid=" + createdUser._id);
                                    })
                            });
                    }
                })
                .catch(err => {
                    console.log(err);
                    return res.status(400).send(err);
                });
        })
        .catch(error => {
            console.log(error);
            return res.status(400).send(error);
        });
};