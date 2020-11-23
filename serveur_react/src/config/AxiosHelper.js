const axios = require('axios');

function createGetAxiosRequest(route) {
    return new Promise((resolve, reject) => {
        axios.get("localhost:5000/" + route, {
            headers: {
                Authorization: `token ` + localStorage.getItem("token"),
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
        axios.post("localhost:5000/" + route, {
            headers: {
                Authorization: `token ` + localStorage.getItem("token"),
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
