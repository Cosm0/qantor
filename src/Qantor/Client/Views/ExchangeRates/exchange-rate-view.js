import React from 'react';

export default class ExchangeRateView extends React.Component {
    render() {
        return (
            <tr>
                <th scope="row">{this.props.exchangeRate.currency}</th>
                <td>{this.props.exchangeRate.unit}</td>
                <td>{this.props.exchangeRate.purchasePrice.toFixed(4)}</td>
                <td>{this.props.exchangeRate.sellPrice.toFixed(4)}</td>
            </tr>);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !this.props.exchangeRate.equals(nextProps.exchangeRate);
    }
};
