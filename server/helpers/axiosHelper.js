const axios = require('axios');
const CommonHelper = require('../helpers/commonHelper');

const api = axios.create({
  baseURL: process.env.API_BASE_URL || 'https://dummyjson.com',
  timeout: 5000, // Set a timeout for requests
  headers: {
    'Content-Type': 'application/json'
  }
});

const getData = async (url) => {
  try {
    const timeStart = process.hrtime();
    const response = await api.get(url);
    const timeDiff = process.hrtime(timeStart);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);
    const logData = { timeTaken: timeTaken, uri: url };
    CommonHelper.log(['INFO', 'getData', 'axiosHelper.js'], { logData });

    return response.data;
  } catch (error) {
    CommonHelper.log(`GET ${url} failed:`, error);
    throw error;
  }
};

module.exports = {
  getData
};
