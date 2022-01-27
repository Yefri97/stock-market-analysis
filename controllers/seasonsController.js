const alphavantage = require('../utils/alphavantage');

const getExchangeRate = (open, close) => (close - open) / open;

module.exports = {
    getSeasonalExchangeRate: function(req, res) {
        const { symbol } = req.query;
        console.log(symbol);
        const data = [
            {
                'month': 'Jan (1 - 15)',
                'avg': 0.65,
                'var': 1.63,
                'years': [
                    {
                        'year': 2020,
                        'exchange_rate': 2.1,
                    },
                    {
                        'year': 2021,
                        'exchange_rate': 1.3,
                    }
                ]
            },
            {
                'month': 'Jan (16 - 31)',
                'avg': 1.3,
                'var': 0.5,
                'years': [
                    {
                        'year': 2020,
                        'exchange_rate': 1.2,
                    },
                    {
                        'year': 2021,
                        'exchange_rate': 0.1,
                    }
                ]
            }
        ];
        res.json({ data });
    },
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