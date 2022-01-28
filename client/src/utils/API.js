import axios from 'axios';

const API = {
    getSeasonalExchangeRate: function(symbol) {
        return axios.get(`/api/seasons/getSeasonalExchangeRate?symbol=${symbol}`);
    },
    getExchangeRateDaily: function(symbol) {
        return axios.get(`/api/seasons/getExchangeRateDaily?symbol=${symbol}`);
    },
};

export default API;