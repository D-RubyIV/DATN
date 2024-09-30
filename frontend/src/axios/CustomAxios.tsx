// Create an instance using the config defaults provided by the library

import Axios from "axios";

// At this point the timeout config value is `0` as is the default for the library
const instance = Axios.create({
    baseURL: 'http://localhost:9000/api/v1',
    timeout: 2000,
    headers: {}
  });

// Add a request interceptor
Axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
Axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});

export default instance;