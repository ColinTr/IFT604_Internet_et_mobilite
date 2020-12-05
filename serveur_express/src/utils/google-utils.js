const {google} = require('googleapis');

/*******************/
/** CONFIGURATION **/
/*******************/

const googleConfig = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirect: process.env.GOOGLE_REDIRECT_URL, // this must match your google api settings
};

// Infos that google will send
const defaultScope = [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
];

/*************/
/** HELPERS **/
/*************/

module.exports.createConnection = function createConnection() {
    return new google.auth.OAuth2(
        googleConfig.clientId,
        googleConfig.clientSecret,
        googleConfig.redirect
    );
};

module.exports.getConnectionUrl = function getConnectionUrl(auth) {
    return auth.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: defaultScope
    });
};

/**********/
/** MAIN **/
/**********/

module.exports.getGoogleEmailAndTokensFromCode = async function getGoogleAccountFromCode(code) {
    return new Promise(((resolve, reject) => {
        try{
            const auth = new google.auth.OAuth2(
                googleConfig.clientId,
                googleConfig.clientSecret,
                googleConfig.redirect
            );

            auth.getToken(code)
                .then(data => {
                    auth.setCredentials(data.tokens);

                    const service = google.people({version: 'v1', auth});
                    service.people.get({ resourceName: 'people/me',  personFields: 'emailAddresses,names' })
                        .then(me => {
                            resolve({
                                email: me.data.emailAddresses.values().next().value.value,
                                tokens: data.tokens,
                            });
                        })
                        .catch(error => {
                            console.log("error1 =");
                            console.log(error);
                            reject(error);
                        });
                })
                .catch(error => {
                    console.log("error2 =");
                    console.log(error);
                    reject(error);
                });
        }catch (error) {
            console.log("error3 = ");
            console.log(error);
            reject(error);
        }
    }))
};