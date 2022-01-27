import React, { Component } from 'react';
import API from '../utils/API';
import TableBiweeklyChangeAverage from '../pages/TableBiweeklyChangeAverage';
import LineChart from '../pages/LineChart';

class Seasons extends Component {
    state = {
        months: [],
        avgs: [],
        vars: [],
        datasets: []
    }

    buildTable = ({ data }) => {
        const months = []
        const avgs = []
        const vars = []
        const datasets = {}
        data.map(data => { months.push(data.month); avgs.push(data.avg); vars.push(data.var) })
        data.map(data => { data.years.map(years => { if (!datasets[years.year]) datasets[years.year] = []; datasets[years.year].push(years.exchange_rate) } ) })
        this.setState({ months: months, avgs: avgs, vars: vars,  datasets: datasets});
    }

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleSubmit = event => {
        event.preventDefault();
        if (!this.state.symbol) return;
        API.getExchangeRateDaily(this.state.symbol)
            .then(({ data }) => this.buildTable(data))
            .catch(err => console.log(err));
    };

    render() {
        return (
            <>
                <div>
                    <input name="symbol" onChange={this.handleInputChange} />
                    <button onClick={this.handleSubmit}>Submit</button>
                </div>
                <TableBiweeklyChangeAverage months={this.state.months} avgs={this.state.avgs} vars={this.state.vars}/>
                <LineChart months={this.state.months} datasets={this.state.datasets} />
            </>
        );
    }
}

export default Seasons;

