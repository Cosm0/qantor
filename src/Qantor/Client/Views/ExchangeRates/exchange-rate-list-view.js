import React from 'react';
import ExchangeRateView from './exchange-rate-view';

export default class ExchangeRateListView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <table className="table table-striped exchange-rate-list-view bg-light mx-auto">
                <thead>
                    <tr>
                        <th scope="col">Currency</th>
                        <th scope="col">Unit</th>
                        <th scope="col">Purchase&nbsp;Price</th>
                        <th scope="col">Sell&nbsp;Price</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.exchangeRates.map(exchangeRate =>
                        <ExchangeRateView
                            key={exchangeRate.currency}
                            exchangeRate={exchangeRate} />)}
                </tbody>
            </table>);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !this.props.exchangeRates.equals(nextProps.exchangeRates);
    }
};
