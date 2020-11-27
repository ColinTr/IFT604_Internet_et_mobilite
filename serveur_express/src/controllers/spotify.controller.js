const axios = require('axios');
const qs = require('qs');

exports.getToken = async (req, res) => {
    getToken()
        .then((response) => {
            return res.status(200).send(response.data).end();
        })
        .catch((error) => {
            console.log(error);
            return res.status(400).send(error).end();
        });
};

function getToken() {
    const data = {
        grant_type: 'client_credentials',
    };
    const headers = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
            username: process.env.SPOTIFY_CLIENT_ID,
            password: process.env.SPOTIFY_CLIENT_SECRET,
        },
    };

    return new Promise(((resolve, reject) => {
        axios.post('https://accounts.spotify.com/api/token', qs.stringify(data), headers)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
    }));
}

exports.getFeaturedPlaylists = async (req, res) => {
    if (req.params['country_code'] === undefined) {
        return res.status(400).send(new Erreur("Le country_code est manquant dans les paramètres de requête")).end();
    }

    getToken()
        .then(token => {
            const headers = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: "Bearer " + token.access_token
                }
            };
            axios.get('https://api.spotify.com/v1/browse/featured-playlists?country=' + req.params['country_code'] + '&limit=1', headers)
                .then((response) => {
                    return res.status(200).send(response.data).end();
                })
                .catch(error => {
                    console.log(error);
                    return res.status(400).send(error).end();
                });
        })
        .catch(error => {
            console.log(error);
            return res.status(400).send(error).end();
        });
};