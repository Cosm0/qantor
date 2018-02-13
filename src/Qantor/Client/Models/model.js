import { Record } from 'immutable';

export const ExchangeRate = Record({
    currency: '',
    unit: 1,
    purchasePrice: 1,
    sellPrice: 1
});

export const UserAccount = Record({
    currency: '',
    balance: 0.00
});

export const UserTransaction = Record({
    date: new Date(),
    amount: 0,
    currency: '',
    transactionType: ''
});

export const UserData = Record({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    password: ''
})