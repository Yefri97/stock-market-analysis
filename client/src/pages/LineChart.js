import React, { Component } from 'react';

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

class LineChart extends Component {

    constructor(props) {
        super(props);
    }

    getDatasetLineChart = (datasets) => {
        const years = Object.keys(datasets).sort()
        const data = {
            labels: this.props.months,
            datasets: years
                .map((year, idx) => ({
                    id: idx,
                    label: year,
                    data: this.props.datasets[year],
                    borderColor: 'rgb(1, 1, 1, 0)',
                    backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.8)`,
                    pointRadius: 5,
                    pointHoverRadius: 5
                }))
        }
        return data;
    }

    render() {
        const lineChartDatasets = this.getDatasetLineChart(this.props.datasets);
        return (
            <div style={{ padding: "0% 0% 0% 4%" }}>
                <Line
                    datasetIdKey='id'
                    data={lineChartDatasets}
                />
            </div>
        );
    }
}

export default LineChart;
