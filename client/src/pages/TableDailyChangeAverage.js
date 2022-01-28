import React, { Component } from 'react';

class TableDailyChangeAverage extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

        const rowstyle = {
            padding: "0px 0px",
        };

        const tablestyle = {
            border: "1px solid black",
            width: "100%"
        };

        return (
            <div>
                <table style={tablestyle}>
                    <caption>Daily Change Average</caption>
                    <tr>
                        <th scope="row">{(this.props.symbol) ? this.props.symbol : 'Biweekly'}</th>
                        {months.map(month => <th key={month} style={rowstyle}>{month}</th>)}
                    </tr>
                    {this.props.daily_changes.map((day, idx) => (
                        <tr key={idx}>
                            <th key={idx}>{idx + 1}</th>
                            {day.map(avg => <td key={avg} style={rowstyle}>{avg}</td>)}
                        </tr>
                    ))}
                </table>
            </div>
        );
    }
}

export default TableDailyChangeAverage;