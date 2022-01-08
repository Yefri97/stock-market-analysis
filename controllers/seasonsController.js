const alphavantage = require('../utils/alphavantage');

const getExchangeRate = (open, close) => (close - open) / open;

module.exports = {
    getExchangeRateDaily: function(req, res) {
        const { symbol } = req.query;
        alphavantage.getTimeSeriesDaily(symbol, (timeSeriesDaily) => {
            let prev = null;
            const dates = Object.keys(timeSeriesDaily).sort();
            const data = {};
            for (const date of dates) {
                const date_split = date.split('-');
                const year = date_split[0], month = date_split[1], day = date_split[2];
                if (!data[year]) data[year] = {};
                data[year][`${month}-${day}`] = getExchangeRate(prev != null ? prev : timeSeriesDaily[date]['1. open'], timeSeriesDaily[date]['4. close']);
                prev = timeSeriesDaily[date]['4. close'];
            }
            res.json({ 'status': 'ok', data: data });
        });
    },
};