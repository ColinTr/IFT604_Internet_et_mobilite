const axios = require('axios');

function createGetAxiosRequest(route) {
    return new Promise((resolve, reject) => {
        axios.get("http://localhost:5000/" + route, {
            headers: {
                Authorization: `Bearer ` + localStorage.getItem("access_token"),
                //Authorization: "{\"access_token\":\"" + localStorage.getItem("access_token") + "\"," +
                //      "\"refresh_token\":\"" + localStorage.getItem("refresh_token") + "\"}",
            },
        })
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

function createPostAxiosRequest(route) {
    return new Promise((resolve, reject) => {
        axios.post("http://localhost:5000/" + route, {
            headers: {
                Authorization: `Bearer ` + localStorage.getItem("access_token"),
            },
        })
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export default {createGetAxiosRequest, createPostAxiosRequest};
