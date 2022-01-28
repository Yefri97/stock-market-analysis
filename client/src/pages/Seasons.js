import React, { Component } from 'react';
import API from '../utils/API';
import TableBiweeklyChangeAverage from '../pages/TableBiweeklyChangeAverage';
import TableDailyChangeAverage from '../pages/TableDailyChangeAverage';
import LineChart from '../pages/LineChart';

class Seasons extends Component {
    state = {
        months: [],
        avgs: [],
        vars: [],
        datasets: [],
        daily_changes: [],
    }

    buildBiweeklyTable = ({ data }) => {
        const months = []
        const avgs = []
        const vars = []
        const datasets = {}
        data.map(data => { months.push(data.month); avgs.push(data.avg); vars.push(data.var) })
        data.map(data => { data.years.map(years => { if (!datasets[years.year]) datasets[years.year] = []; datasets[years.year].push(years.exchange_rate) } ) })
        this.setState({ symbolSearched: this.state.symbol, months: months, avgs: avgs, vars: vars,  datasets: datasets});
    }

    buildDailyChangeTable = ({ data }) => {
        this.setState({ daily_changes: data })
    }

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleSubmit = event => {
        event.preventDefault();
        if (!this.state.symbol) return;
        API.getSeasonalExchangeRate(this.state.symbol)
            .then(({ data }) => this.buildBiweeklyTable(data))
            .catch(err => console.log(err));
        API.getExchangeRateDaily(this.state.symbol)
            .then(({ data }) => this.buildDailyChangeTable(data))
            .catch(err => console.log(err));
    };

    render() {
        return (
            <>
                <div>
                    <input name="symbol" onChange={this.handleInputChange} />
                    <button onClick={this.handleSubmit}>Submit</button>
                </div>
                <TableBiweeklyChangeAverage symbol={this.state.symbolSearched} months={this.state.months} avgs={this.state.avgs} vars={this.state.vars.map((varz, idx) => this.state.avgs[idx] * 100.0 / varz)}/>
                <LineChart months={this.state.months} datasets={this.state.datasets} />
                <TableDailyChangeAverage daily_changes={this.state.daily_changes} symbol={this.state.symbol}/>
            </>
        );
    }
}

export default Seasons;

