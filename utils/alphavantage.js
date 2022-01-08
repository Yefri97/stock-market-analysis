'use strict';
var request = require('request');

const getTimeSeries = (timeSeries, symbol, callback) => {
    const API_KEY = 'J76ZUD64XNX21I2O';
    var url = `https://www.alphavantage.co/query?function=TIME_SERIES_${timeSeries}&outputsize=full&symbol=${symbol}&apikey=${API_KEY}`;
    request.get({
        url: url,
        json: true,
        headers: { 'User-Agent': 'request' }
    }, (err, res, data) => {
        if (err) {
            console.log('Error:', err);
        } else if (res.statusCode !== 200) {
            console.log('Status:', res.statusCode);
        } else {
            callback(data);
        }
    });
}

module.exports = {
    getTimeSeriesDaily: function(symbol, callback) {
        getTimeSeries('DAILY', symbol, (data) => {
            const timeSeriesDaily = data['Time Series (Daily)'];
            callback(timeSeriesDaily);
        });
    }
}