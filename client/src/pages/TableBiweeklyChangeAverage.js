import React, { Component } from 'react';

class TableBiweeklyChangeAverage extends Component {

    state = {
        
    }

    render() {
        const rowstyle = {
            border: "1px solid black",
        };

        const tablestyle = {
            border: "1px solid black",
            width: "50%"
        };

        return (
            <div>
                <table style={tablestyle}>
                    <caption>QQQ - Biweekly Change Average</caption>
                    <tr>
                        <th scope="row">Biweekly</th>
                        {this.props.months.map(month => <th key={month} style={rowstyle}>{month}</th>)}
                    </tr>
                    <tr>
                        <th>AVG</th>
                        {this.props.avgs.map(avg => <td key={avg} style={rowstyle}>{avg}</td>)}
                    </tr>
                    <tr>
                        <th>VAR</th>
                        {this.props.vars.map(varz => <td key={varz} style={rowstyle}>{varz}</td>)}
                    </tr>
                </table>
            </div>
        );
    }
}

export default TableBiweeklyChangeAverage;