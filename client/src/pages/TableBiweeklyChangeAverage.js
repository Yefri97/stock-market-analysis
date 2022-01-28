import React, { Component } from 'react';
import ColorScale from "https://cdn.skypack.dev/color-scales";

class TableBiweeklyChangeAverage extends Component {

    state = {
        
    }

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
            console.log(maxElem, minElem);
            const cs2Stops = new ColorScale(minElem, maxElem, ["#ff0084", "#ffff84"], 1.0);
            console.log(cs2Stops.getColor(elem).toRGBString());
            const rowstyle = {
                border: "1px solid black",
                backgroundColor: cs2Stops.getColor(elem).toRGBString(),
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
                        {this.props.avgs.map(avg => <td key={avg} style={getRowStyle('avgs', avg)}>{avg.toFixed(2)}</td>)}
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