import axios from 'axios';

const API = {
    getExchangeRateDaily: function(symbol) {
        return axios.get(`/api/seasons/getSeasonalExchangeRate?symbol=${symbol}`);
    },
};

export default API;