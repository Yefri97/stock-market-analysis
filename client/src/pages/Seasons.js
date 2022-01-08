import React, { Component } from 'react';
import API from '../utils/API';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const getDays = () => {
    const days = [];
    const x = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const formatNumber = (x) => x < 10 ? `0${x}` : x;
    for (let i = 1; i <= 12; i++) {
        for (let j = 1; j <= x[i-1]; j++) {
            // if (i < 8 || i == 8 && j <= 15) continue;
            days.push(`${formatNumber(i)}-${formatNumber(j)}`)
        }
    }
    return days;
}

const getHistoric = (dt) => {
    const row = [];
    let current = 1.0;
    for (const val of dt) {
        current = current * (1.0 + val);
        row.push((current - 1.0) * 100.0);
    }
    return row;
}

class Seasons extends Component {
    state = {
        headers: [],
        table: [],
        checkedYears: {},
    }

    buildTable = ({ data }) => {
        const table = [];
        const years = Object.keys(data).sort().reverse();
        const days = getDays();

        for (const year of years) {
            const row = [];
            for (const idx in days) {
                const day = days[idx];
                const val = data[year][day] ? data[year][day] : 0.0;
                row.push(val);
            }
            table.push({ year, row });
        }
        this.setState({ headers: days, table: table });
    }

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleCheckboxChange = event => {
        const { name, checked } = event.target;
        const { checkedYears } = this.state;
        checkedYears[name] = checked;
        this.setState({ checkedYears });
    }

    handleSubmit = event => {
        event.preventDefault();
        if (!this.state.symbol) return;
        API.getExchangeRateDaily(this.state.symbol)
            .then(({ data }) => this.buildTable(data))
            .catch(err => console.log(err));
    };

    getData = () => {
        const data = [];
        let lengthCheckedYears = 0;
        for (const dt of this.state.table) {
            const { year } = dt;
            lengthCheckedYears += (this.state.checkedYears[year] !== false);
        }
        const days = getDays();
        const prom = days.map(_ => 0.0);
        for (const dt of this.state.table) {
            const { year, row } = dt;
            if (this.state.checkedYears[year] === false) continue;
            for (const idx in days) prom[idx] += row[idx] / lengthCheckedYears;
            data.push({ year, row });
        }
        const vari = days.map(_ => 0.0);
        for (const dt of this.state.table) {
            const { year, row } = dt;
            if (this.state.checkedYears[year] === false) continue;
            for (const idx in days) {
                const d = row[idx] - prom[idx];
                vari[idx] += d * d;
            }
        }
        data.push({ year: 'prom', row: prom });
        data.push({ year: 'vari', row: vari.map(vv => Math.sqrt(vv)) });
        return data;
    }

    render() {
        return (
            <div>
                <input name="symbol" onChange={this.handleInputChange} />
                <button onClick={this.handleSubmit}>Submit</button>
                {/*<table>
                    <tr><th>-</th>{this.state.headers.map(header => <th>{header}</th>)}</tr>
                    {this.state.table.map(({ year, row }) => (<tr><td>{year}</td>{row.map(cell => <td>{cell}</td>)}</tr>))}
                </table>*/}
                <br/>
                {this.state.table.filter(({ year }) => year != 'prom').map(({ year }) => 
                    <label>
                        <input
                            name={year}
                            type="checkbox"
                            checked={year in this.state.checkedYears ? this.state.checkedYears[year] : true}
                            onChange={this.handleCheckboxChange}
                        />
                        {year}
                    </label>
                )}
                <Line
                    datasetIdKey='id'
                    options={{
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            grid: { drawOnChartArea: false },
                        }
                    }}
                    data={{
                        labels: this.state.headers,
                        datasets: this.getData()
                            .map(({ year, row }, idx) => ({
                                id: idx,
                                label: year,
                                data: year == 'vari' ? row : getHistoric(row),
                                backgroundColor: year == 'prom' ? 'rgba(255, 99, 132, 0.5)' : year == 'vari' ? 'rgba(53, 162, 235, 0.5)' : 'rgba(0, 0, 0, 0.2)',
                                yAxisID: year == 'vari' ? 'y' : 'y1',
                            }))
                    }}
                    onChange={(event) => console.log(event)}
                />
            </div>
        );
    }
}

export default Seasons;