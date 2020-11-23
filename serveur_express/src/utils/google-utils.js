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
    try{
        const auth = new google.auth.OAuth2(
            googleConfig.clientId,
            googleConfig.clientSecret,
            googleConfig.redirect
        );

        const data = await auth.getToken(code);
        auth.setCredentials(data.tokens);

        const service = google.people({version: 'v1', auth});
        const me = await service.people.get({ resourceName: 'people/me',  personFields: 'emailAddresses,names' });

        return {
            email: me.data.emailAddresses.values().next().value.value,
            tokens: data.tokens,
        };
    }catch (error) {
        console.log("error = ", error)
    }
};