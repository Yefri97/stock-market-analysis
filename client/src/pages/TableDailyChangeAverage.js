import React, { Component } from 'react';
import ColorScale from "https://cdn.skypack.dev/color-scales";

class TableDailyChangeAverage extends Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.selectableDates = [];
    }

    handleSelectChange = event => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    getAnalytics = () => {
        const { table } = this.props;
        const { initDate, endDate } = this.state;
        if (!initDate || !endDate) return [];
        const info = {};
        for (let month = 0; month < 12; month++) {
            for (let day = 0; day < 31; day++) {
                const current = month * 12 + day;
                if (initDate <= current && current <= endDate) {
                    table[day][month].map(({ open, close, year }) => {
                        if (year in info) info[year]['close'] = close;
                        else info[year] = { 'open': open, 'close': close };
                    });
                }
            }
        }
        const analytics = [];
        const years = Object.keys(info).sort().reverse();
        const getExchangeRate = (open, close) => ((close - open) / open) * 100.0;
        for (const year of years) analytics.push({
            year: year,
            value: getExchangeRate(info[year]['open'], info[year]['close']),
        });
        return analytics;
    }

    render() {

        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

        const selectableDates = [];
        for (let month = 0; month < 12; month++) for (let day = 1; day <= 31; day++)
            selectableDates.push({ value: month * 12 + (day - 1), option: months[month] + " " + day });

        const tablestyle = {
            border: "1px solid black",
            width: "75%"
        };

        const getRowStyle = (elem) => {
            const maxElem = Math.max(...this.props.daily_changes.flat());
            const minElem = Math.min(...this.props.daily_changes.flat());
            const cs2Stops = new ColorScale(minElem, maxElem, ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850", "#006837"], 1.0);
            const backgroundColor = elem ? cs2Stops.getColor(elem).toRGBString() : "#000000";
            const rowstyle = {
                border: "1px solid black",
                backgroundColor: backgroundColor,
                textAlign: "center"
            };
            return rowstyle;
        }

        const analytics = this.getAnalytics();

        const getAverage = (window) => {
            if (analytics.length == 0) return "-";
            const total = analytics.slice(0, window).reduce((acum, curr) => acum + curr.value, 0);
            const ans = total / Math.min(analytics.length, window);
            return ans.toFixed(2);
        };

        const getAssertivity = (window) => {
            if (analytics.length == 0) return "-";
            const total = analytics.slice(0, window).reduce((acum, curr) => acum + (curr.value > 0), 0);
            const ans = total * 100.0 / Math.min(analytics.length, window);
            return ans.toFixed(2);
        };

        return (
            <div style={{ display: 'flex' }}>
                <table style={tablestyle}>
                    <caption>Daily Change Average</caption>
                    <tr>
                        <th scope="row" style={{border: "1px solid black"}}>{(this.props.symbol) ? this.props.symbol : 'Biweekly'}</th>
                        {months.map((month, idx) => <th key={idx} style={{border: "1px solid black"}}>{month}</th>)}
                    </tr>
                    {this.props.daily_changes.map((day, idx) => (
                        <tr key={`th_${idx}`}>
                            <th>{idx + 1}</th>
                            {day.map((avg, idx2) => <td key={`td_${idx*12+idx2}`} style={getRowStyle(avg)}>{avg ? avg.toFixed(2): ""}%</td>)}
                        </tr>
                    ))}
                </table>
                <div style={{ height: "100%", width: "24%" }}>
                    <div style={{ marginLeft: "15px" }}>
                        <select style={{ width: "33%", fontSize: "16px" }} name="initDate" onChange={this.handleSelectChange}>
                            <option value="">Init date</option>
                            {selectableDates.map(date => <option value={date.value}>{date.option}</option>)}
                        </select>
                        <select style={{ width: "33%", fontSize: "16px" }} name="endDate" onChange={this.handleSelectChange}>
                            <option value="">End date</option>
                            {selectableDates.map(date => <option value={date.value}>{date.option}</option>)}
                        </select>
                        <select style={{ width: "33%", fontSize: "16px" }} name="trending" onChange={this.handleSelectChange}>
                                <option value="">Tendencia</option>
                                <option value="up">Alcista</option>
                                <option value="dw">Bajista</option>
                        </select>
                    </div>
                    <table className='analytics' style={{ height: "100%", width: "100%", textAlign: 'center' }}>
                        <caption>Analytics</caption>
                        <tr><th colspan="2">All time</th></tr>
                        <tr className='subtitle-table'><td>Average</td><td>Assertivity</td></tr>
                        <tr className='body-table'><td>{getAverage(50)}%</td><td>{getAssertivity(50)}%</td></tr>
                        <tr><th colspan="2">Last 5 years</th></tr>
                        <tr className='subtitle-table'><td>Average</td><td>Assertivity</td></tr>
                        <tr className='body-table'><td>{getAverage(5)}%</td><td>{getAssertivity(5)}%</td></tr>
                        <tr><th colspan="2">Last 10 years</th></tr>
                        <tr className='subtitle-table'><td>Average</td><td>Assertivity</td></tr>
                        <tr className='body-table'><td>{getAverage(10)}%</td><td>{getAssertivity(10)}%</td></tr>
                        <tr><th colspan="2">Dates</th></tr>
                        <tr className='subtitle-table'><td>Year</td><td>Gain/Loss</td></tr>
                        {analytics.map(a => <tr className={a.value > 0 ? 'body-table-gain' : 'body-table-loss'}><td>{a.year}</td><td>{a.value.toFixed(4)}%</td></tr>)}
                    </table>
                </div>
            </div>
        );
    }
}

export default TableDailyChangeAverage;