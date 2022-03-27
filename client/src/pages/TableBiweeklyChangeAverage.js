import React, { Component } from 'react';

class TableBiweeklyChangeAverage extends Component {
    render() {
        const containerStyle = {
            padding: "0px 0px",
        };

        const tablestyle = {
            border: "1px solid black",
            width: "100%"
        };

        const getRowStyle = (row, elem) => {
            const maxElem = Math.max(...this.props[row]);
            const minElem = Math.min(...this.props[row]);
            const cs2Stops = ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850", "#006837"];
            const idxColor = Math.round((elem - minElem) / (maxElem - minElem) * 10);
            const rowstyle = {
                border: "1px solid black",
                backgroundColor: cs2Stops[idxColor],
                textAlign: "center"
            };
            return rowstyle;
        }

        return (
            <div style={containerStyle}>
                <table style={tablestyle}>
                    <caption>{this.props.symbol} - Biweekly Change Average</caption>
                    <tr>
                        <th scope="row">Biweekly</th>
                        {this.props.months.map(month => <th key={month} style={{border: "1px solid black"}}>{month}</th>)}
                    </tr>
                    <tr>
                        <th>AVG</th>
                        {this.props.avgs.map(avg => <td key={avg} style={getRowStyle('avgs', avg)}>{avg.toFixed(2)}%</td>)}
                    </tr>
                    <tr>
                        <th>VAR</th>
                        {this.props.vars.map(varz => <td key={varz} style={getRowStyle('vars', varz)}>{varz.toFixed(2)}</td>)}
                    </tr>
                </table>
            </div>
        );
    }
}

export default TableBiweeklyChangeAverage;