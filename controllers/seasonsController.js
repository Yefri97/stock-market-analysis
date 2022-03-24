const alphavantage = require("../utils/alphavantage");

const nameMonth = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const endDayMonths = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const getAverage = (data) => {
  const total = data.reduce((acum, curr) => acum + curr, 0);
  return total / data.length;
};

const getVariance = (data) => {
  const avg = getAverage(data);
  return Math.sqrt(
    data.reduce((acum, curr) => acum + Math.pow(avg - curr, 2), 0)
  );
};

const getExchangeRate = (open, close) => ((close - open) / open) * 100.0;

const getDateInfo = (date) => {
  const date_split = date.split("-");
  const year = date_split[0],
    month = date_split[1],
    day = date_split[2];
  return { year, month, day };
};

module.exports = {
  getSeasonalExchangeRate: function (req, res) {
    const { symbol } = req.query;
    alphavantage.getTimeSeriesDaily(symbol, (timeSeriesDaily) => {
      const data = {};
      const dates = Object.keys(timeSeriesDaily).sort();
      let left = 0,
        right = 0;
      while (right < dates.length) {
        const { month: month1 } = getDateInfo(dates[left]);
        const { month: month2 } = getDateInfo(dates[right]);
        if (month1 != month2) break;
        right++;
      }
      left = right;
      while (left < dates.length) {
        const { year, month } = getDateInfo(dates[left]);
        while (right < dates.length) {
          const target = `${year}-${month}-15`;
          if (dates[right] > target) break;
          right++;
        }
        const firstBiWeek = `${month}. ${nameMonth[month - 1]} (1-15)`;
        if (!data[firstBiWeek]) data[firstBiWeek] = {};
        data[firstBiWeek][year] = getExchangeRate(
          timeSeriesDaily[dates[left]]["1. open"],
          timeSeriesDaily[dates[right - 1]]["4. close"]
        );
        left = right;
        while (right < dates.length) {
          const target = `${year}-${month}-${endDayMonths[month - 1]}`;
          if (dates[right] > target) break;
          right++;
        }
        const secondBiWeek = `${month}. ${nameMonth[month - 1]} (16-${
          endDayMonths[month - 1]
        })`;
        if (!data[secondBiWeek]) data[secondBiWeek] = {};
        data[secondBiWeek][year] = getExchangeRate(
          timeSeriesDaily[dates[left]]["1. open"],
          timeSeriesDaily[dates[right - 1]]["4. close"]
        );
        left = right;
      }
      const response = [];
      const biweeks = Object.keys(data).sort();
      for (const biweek of biweeks) {
        const yearsData = [];
        const years = Object.keys(data[biweek]).sort();
        for (const year of years) {
          yearsData.push({
            year: year,
            exchange_rate: data[biweek][year],
          });
        }
        response.push({
          month: biweek.slice(4),
          avg: getAverage(yearsData.map((y) => y["exchange_rate"])),
          var: getVariance(yearsData.map((y) => y["exchange_rate"])),
          years: yearsData,
        });
      }
      return res.json({ status: "ok", data: response });
    });
  },
  getExchangeRateDaily: function (req, res) {
    const { symbol } = req.query;
    alphavantage.getTimeSeriesDaily(symbol, (timeSeriesDaily) => {
      const dates = Object.keys(timeSeriesDaily).sort();
      const table = Array.from({ length: 31 }, (_) => Array.from({ length: 12 }, (_) => []));
      for (const date of dates) {
        let { month, day, year } = getDateInfo(date);
        month = parseInt(month), day = parseInt(day);
        table[day - 1][month - 1].push({
          open: timeSeriesDaily[date]["1. open"],
          close: timeSeriesDaily[date]["4. close"],
          value: getExchangeRate(timeSeriesDaily[date]["1. open"], timeSeriesDaily[date]["4. close"]),
          year: year,
        });
      }
      const data = table.map((row) => row.map((cell) => getAverage(cell.map(c => c.value))));
      res.json({ status: "ok", data, table });
    });
  },
};
