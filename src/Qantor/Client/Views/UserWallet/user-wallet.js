import React from 'react';
import { List } from 'immutable';
import { BackgroundUpdater, DefaultUpdateInterval } from '../background-updater';
import Modal from '../modal';
import TransactionView from './transaction-view';
import UserAccountListView from '../UserAccounts/user-account-list-view';
import ExchangeRateListView from '../ExchangeRates/exchange-rate-list-view';
import { UserAccount } from '../../Models/model';

const UserAccountsUpdateInterval = 1000;

const currencyValues = ['PLN', 'USD', 'EUR', 'CHF', 'RUB', 'CZK', 'GBP', 'AED'];
const transactionRejectedMessage = 'Transaction cannot be complete as it would cause negative account balance.';

export default class UserWallet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            depositWithdrawAmount: '0.00',
            purchaseSellAmount: '0.00',
            depositWithdrawCurrency: 'PLN',
            purchaseSellCurrency: 'USD',
            transactionType: 'Deposit',
            confirmationMessage: '',
            isModalOpen: false,
            yesNoModal: false
        };
        
        this.onAmountChange = this.onAmountChange.bind(this);
        this.onCurrencyChange = this.onCurrencyChange.bind(this);
        this.onModalClose = this.onModalClose.bind(this);
        this.onTransactionButtonClick = this.onTransactionButtonClick.bind(this);
    }

    onAmountChange(e) {
        const newState = { };
        newState[e.target.id] = e.target.value;
        this.setState(newState);
    }

    onCurrencyChange(sender) {
        if (sender.props.id === 'depositWithdrawCurrency') {
            this.setState({
                depositWithdrawCurrency: currencyValues[sender.value]
            });
        } else {
            this.setState({
                purchaseSellCurrency: currencyValues[sender.value + 1]
            });
        }
    }

    async onModalClose(e) {
        if (e.target.value === 'Yes') {
            const { depositWithdrawAmount, depositWithdrawCurrency, purchaseSellAmount, purchaseSellCurrency, transactionType } = this.state;

            if (transactionType === 'Deposit' || transactionType === 'Withdraw') {
                await this.props.dataAccessor.addNewUserTransaction(depositWithdrawAmount, depositWithdrawCurrency, transactionType);
            }
            else if (transactionType === 'Purchase' || transactionType === 'Sell') {
                await this.props.dataAccessor.addNewUserTransaction(purchaseSellAmount, purchaseSellCurrency, transactionType);
            }
        }

        this.setState({ isModalOpen: false });
    }

    async onTransactionButtonClick(e) {
        e.preventDefault();

        const transactionType = e.target.value;
        this.setState({ transactionType: transactionType });

        this.getConfirmationMessage(transactionType).then(message => {
            if (message === transactionRejectedMessage) {
                this.setState({
                    confirmationMessage: message,
                    isModalOpen: true,
                    yesNoModal: false
                });
            } else {
                this.setState({
                    confirmationMessage: message,
                    isModalOpen: true,
                    yesNoModal: true
                });
            }
        });
    }

    async getConfirmationMessage(transactionType) {
        const { depositWithdrawAmount, depositWithdrawCurrency, purchaseSellAmount, purchaseSellCurrency } = this.state;
        const userAccounts = await this.props.dataAccessor.loadCurrentUserAccounts();

        if ((transactionType === 'Deposit') || (transactionType === 'Withdraw')) {
            const balance = userAccounts.get(userAccounts.findIndex(account => account.currency === depositWithdrawCurrency)).balance;

            if (transactionType === 'Deposit') {
                if (balance - (-depositWithdrawAmount) < 0) {
                    return transactionRejectedMessage;
                }
                return 'Your ' + depositWithdrawCurrency + ' account balance will be increased by ' + depositWithdrawAmount + depositWithdrawCurrency + '. Continue?';
            } else if (transactionType === 'Withdraw') {
                if (balance - depositWithdrawAmount < 0) {
                    return transactionRejectedMessage;
                }
                return 'Your ' + depositWithdrawCurrency + ' account balance will be decreased by ' + depositWithdrawAmount + depositWithdrawCurrency + '. Continue?';
            }
        } else if (transactionType === 'Purchase' || transactionType === 'Sell') {
            const bonus = await this.props.dataAccessor.getCurrentUserBonus();
            const exchangeRates = await this.props.dataAccessor.loadCurrentExchangeRates();
            const exchangeRate = exchangeRates.get(exchangeRates.findIndex(rate => rate.currency === purchaseSellCurrency));

            if (transactionType === 'Purchase') {
                const amount = (purchaseSellAmount * exchangeRate.sellPrice * (1 - bonus) / exchangeRate.unit).toFixed(2);
                const balance = userAccounts.get(userAccounts.findIndex(account => account.currency === 'PLN')).balance;

                if (balance - amount < 0) {
                    return transactionRejectedMessage;
                }
                return 'Your PLN account balance will be decreased by ' + amount + 'PLN. Continue?';
            } else if (transactionType === 'Sell') {
                const amount = (purchaseSellAmount * exchangeRate.purchasePrice * (1 + bonus) / exchangeRate.unit).toFixed(2);
                const balance = userAccounts.get(userAccounts.findIndex(account => account.currency === purchaseSellCurrency)).balance;

                if (balance - purchaseSellAmount < 0) {
                    return transactionRejectedMessage;
                }
                return 'Your PLN account balance will be increased by ' + amount + 'PLN. Continue?';
            }
        }

        return null;
    }

    render() {
        return (
            <div className="mx-auto">
                <div className="container">
                    <div className="row p-3">
                        <div className="col">
                            <TransactionView
                                includePLN={true}
                                amountTextBoxName='depositWithdrawAmount'
                                onAmountChange={this.onAmountChange}
                                currencyDropDownName='depositWithdrawCurrency'
                                onCurrencyChange={this.onCurrencyChange}
                                inputTransactionButtonValue='Deposit'
                                outputTransactionButtonValue='Withdraw'
                                onTransactionButtonClick={this.onTransactionButtonClick} />
                        </div>
                    </div>
                    <div className="row p-3">
                        <div className="col">
                            <TransactionView
                                includePLN={false}
                                amountTextBoxName='purchaseSellAmount'
                                onAmountChange={this.onAmountChange}
                                currencyDropDownName='purchaseSellCurrency'
                                onCurrencyChange={this.onCurrencyChange}
                                inputTransactionButtonValue='Purchase'
                                outputTransactionButtonValue='Sell'
                                onTransactionButtonClick={this.onTransactionButtonClick} />
                        </div>
                    </div>
                    <div className="row p-3">
                        <div className="col">
                            <BackgroundUpdater
                                enabled={true}
                                interval={UserAccountsUpdateInterval}
                                initialData={List()}
                                fetch={() => this.props.dataAccessor.loadCurrentUserAccounts()}
                                view={data => <UserAccountListView userAccounts={data} />} />
                        </div>
                        <div className="col">
                            <BackgroundUpdater
                                enabled={true}
                                interval={DefaultUpdateInterval}
                                initialData={List()}
                                fetch={() => this.props.dataAccessor.loadCurrentExchangeRates()}
                                view={data => <ExchangeRateListView exchangeRates={data} />}/>
                        </div>
                    </div>
                </div>
                <Modal isOpen={this.state.isModalOpen} onClose={() => this.closeModal()}>
                    <p>{this.state.confirmationMessage}</p>
                    <p>
                        {this.state.yesNoModal ? <button value='Yes' onClick={this.onModalClose}>Yes</button> : null}
                        {this.state.yesNoModal ? <button value='No' onClick={this.onModalClose}>No</button> : null}
                        {!this.state.yesNoModal ? <button value='OK' onClick={this.onModalClose}>OK</button> : null}
                    </p>
                </Modal>
            </div>);
    }
}
