import React from 'react';
import { List } from 'immutable';
import { DropdownList } from '../elements';

export default class TransactionView extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container mx-auto bg-light p-3"> 
                <div className="row no-gutters">
                    <div className="col-auto p-1">
                        <div className="amount-input-wrapper">
                            <input
                                id={this.props.amountTextBoxName}
                                type="text"
                                className="form-control"
                                placeholder="Amount"
                                aria-label="Username"
                                aria-describedby="basic-addon1"
                                onChange={this.props.onAmountChange}/>
                        </div>
                    </div>
                    <div className="col-auto p-1">
                        <div className="currency-dropdown-wrapper">
                            <DropdownList
                                id={this.props.currencyDropDownName}
                                onSelectionChanged={this.props.onCurrencyChange}>
                                {this.props.includePLN ? 'PLN (Polish Zloty)' : null}
                                {'USD (US Dollar)'}
                                {'EUR (Euro)'}
                                {'CHF (Swiss Franc)'}
                                {'RUB (Russian Ruble)'}
                                {'CZK (Czech Koruna)'}
                                {'GBP (Pound Sterling)'}
                                {'AED (Emirati Dirham)'}
                            </DropdownList>
                        </div>
                    </div>
                </div>
                <div className="row no-gutters">
                    <div className="col-auto p-1">
                        <button
                            className="btn btn-primary"
                            value={this.props.inputTransactionButtonValue}
                            onClick={this.props.onTransactionButtonClick}>{this.props.inputTransactionButtonValue}</button>
                    </div>
                    <div className="col-auto p-1">
                        <button
                            className="btn btn-primary"
                            value={this.props.outputTransactionButtonValue}
                            onClick={this.props.onTransactionButtonClick}>{this.props.outputTransactionButtonValue}</button>
                    </div>
                </div>
            </div>);
    }
}
