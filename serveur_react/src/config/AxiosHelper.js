const axios = require("axios");

const KOBOARD_API_URI = process.env.REACT_APP_KOBOARD_API_URI;

function createGetAxiosRequest(route) {
    return new Promise((resolve, reject) => {
        axios.get(KOBOARD_API_URI + "/" + route, {
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

function createPostAxiosRequest(route, data) {
    const headers = {
        headers: {
            Authorization: `Bearer ` + localStorage.getItem("access_token"),
        },
    };

    return new Promise((resolve, reject) => {
        axios.post(KOBOARD_API_URI + "/" + route, data, headers)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

function createPutAxiosRequest(route, id, data) {
    const headers = {
        headers: {
            Authorization: `Bearer ` + localStorage.getItem("access_token"),
        },
    };

    return new Promise((resolve, reject) => {
        axios.put(KOBOARD_API_URI + "/" + route + "/" + id, data, headers)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

function createDeleteAxiosRequest(route, id) {
    const headers = {
        headers: {
            Authorization: `Bearer ` + localStorage.getItem("access_token"),
        },
    };

    return new Promise((resolve, reject) => {
        axios.delete(KOBOARD_API_URI + "/" + route + "/" + id, headers)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export default {createGetAxiosRequest, createPostAxiosRequest, createDeleteAxiosRequest, createPutAxiosRequest};
