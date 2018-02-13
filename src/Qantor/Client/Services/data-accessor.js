import { List } from 'immutable';
import { fetchJson } from '../fetch';
import { ExchangeRate, UserAccount, UserTransaction, UserData } from '../Models/model';

export default class DataAccessor {
    constructor(authService) {
        this.authService = authService;
    }

    isAnonymous() {
        return this.authService.getUserId() === null;
    }

    async loadCurrentExchangeRates() {
        return List((await fetchJson('exchangerates/current', 'GET')).map(x => new ExchangeRate(x)));
    }

    async loadCurrentUserAccounts() {
        return List((await this.authService.fetchAuthorizedJson(`users/${this.authService.getUserId()}/accounts`, 'GET')).map(x => new UserAccount({
            currency: x.currency,
            balance: x.balance
        })));
    }

    async loadCurrentUserTransactions() {
        return List((await this.authService.fetchAuthorizedJson(`users/${this.authService.getUserId()}/transactions`, 'GET')).map(x => new UserTransaction({
            date: Date.parse(x.date),
            amount: x.amount,
            currency: x.currency,
            transactionType: x.transactionType
        })));
    }

    async addNewUserTransaction(amount, currency, transactionType) {
        return await this.authService.fetchAuthorizedJson(`users/${this.authService.getUserId()}/transactions`, 'POST', {
            amount,
            currency,
            transactionType
        });
    }

    async loadUserDataAsync() {
        var response = await this.authService.fetchAuthorizedJson(`users/${this.authService.getUserId()}/user`, 'GET');
        response.dateOfBirth = response.dateOfBirth.substr(0, 10); // remove time from date
        return new UserData(response);
    }

    async editUserData(firstName, lastName, dateOfBirth, email, password) {
        return await this.authService.fetchAuthorizedJson(`/users/${this.authService.getUserId()}/user`, 'POST', {
            firstName, lastName, dateOfBirth, email, password
        });
    }

    async getCurrentUserBonus() {
        return await this.authService.fetchAuthorizedJson(`users/${this.authService.getUserId()}/bonus`, 'GET');
    }
};
