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

    buildBiweeklyTable = ({ status, data, minYear, maxYear }) => {
        const months = []
        const avgs = []
        const vars = []
        const datasets = {}
        if (status != 'ok') return alert("Hubo un problema con el servidor, intente de nuevo");
        data.map(data => { months.push(data.month); avgs.push(data.avg); vars.push(data.var) })
        data.map(data => { data.years.map(years => { if (!datasets[years.year]) datasets[years.year] = []; datasets[years.year].push(years.exchange_rate) } ) })
        this.setState({ symbolSearched: this.state.symbol, months: months, avgs: avgs, vars: vars,  datasets: datasets, minYear, maxYear });
    }

    buildDailyChangeTable = ({ status, data, table }) => {
        if (status != 'ok') return alert("Hubo un problema con el servidor, intente de nuevo");
        this.setState({ daily_changes: data, table })
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

    handleSelectChange = event => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
        API.getSeasonalExchangeRate(value)
            .then(({ data }) => this.buildBiweeklyTable(data))
            .catch(err => console.log(err));
        API.getExchangeRateDaily(value)
            .then(({ data }) => this.buildDailyChangeTable(data))
            .catch(err => console.log(err));
    }

    render() {
        return (
            <>
                <div style={{ margin: "25px 0px" }}>
                    <input name="symbol" onChange={this.handleInputChange} style={{ marginLeft: "45%" }} />
                    <button onClick={this.handleSubmit}>Submit</button>
                    { /* <select name="symbol" onChange={this.handleSelectChange} style={{ marginLeft: "40%", fontSize: "20px" }}>
                        <option value="">-</option>
                        <option value="VOX">Communication Services ETF (VOX)</option>
                        <option value="VCR">Consumer Discretionary ETF (VCR)</option>
                        <option value="VDC">Vanguard Consumer Staples ETF (VDC)</option>
                        <option value="VDE">Vanguard Energy ETF (VDE)</option>
                        <option value="VFH">Vanguard Financials ETF (VFH)</option>
                        <option value="VHT">Vanguard Health Care ETF (VHT)</option>
                        <option value="VIS">Vanguard Industrials ETF (VIS)</option>
                        <option value="VGT">Vanguard Information Technology ETF (VGT)</option>
                        <option value="VAW">Vanguard Materials ETF (VAW)</option>
                        <option value="VNQ">Vanguard Real Estate ETF (VNQ)</option>
                        <option value="VPU">Vanguard Utilities ETF (VPU)</option>
                    </select> */ }
                </div>
                <br/>
                {this.state.symbolSearched && (
                    <>
                        <TableBiweeklyChangeAverage
                            symbol={this.state.symbolSearched}
                            months={this.state.months}
                            avgs={this.state.avgs}
                            vars={this.state.vars.map((varz, idx) => this.state.avgs[idx] * 100.0 / varz)}
                            minYear={this.state.minYear}
                            maxYear={this.state.maxYear}
                        />
                        <br/>
                        <LineChart months={this.state.months} datasets={this.state.datasets} />
                        <br/>
                        <TableDailyChangeAverage
                            daily_changes={this.state.daily_changes}
                            symbol={this.state.symbol}
                            table={this.state.table}
                            minYear={this.state.minYear}
                            maxYear={this.state.maxYear}
                        />
                    </>
                )}
            </>
        );
    }
}

export default Seasons;

