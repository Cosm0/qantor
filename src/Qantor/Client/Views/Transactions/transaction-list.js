import React from 'react';
import Styled from 'styled-components';
import { List } from 'immutable';
import dateFormat from 'dateformat';
import AdvancedTable, { Column, BootstrapColumnTemplate } from '../advanced-table';
import { BackgroundUpdater, DefaultUpdateInterval } from '../background-updater';
import { UserTransaction } from '../../Models/model';

const PositiveValue = Styled.div`
    &:before {
        content: '+';
    }
`;

const NegativeValue = Styled.div`
    &:before {
        content: '-';
    }
`;

const formatTransactionValue = function (transactionType, amount, currency) {
    return transactionType === 'Withdraw' || transactionType === 'Sell'
        ? <NegativeValue className="text-danger">{amount} {currency}</NegativeValue>
        : <PositiveValue className="text-success">{amount} {currency}</PositiveValue>;
};

const transactionListColumns = List([
    new Column('Date', x => dateFormat(x.date, 'yyyy-mm-dd HH:MM:ss'), x => x.date),
    new Column('Transaction', x => x.transactionType, x => x.transactionType),
    new Column('Value', x => formatTransactionValue(x.transactionType, x.amount, x.currency), x => x.amount)
]);

export default class TransactionList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <BackgroundUpdater
                enabled={true}
                interval={DefaultUpdateInterval}
                initialData={List()}
                fetch={() => this.props.dataAccessor.loadCurrentUserTransactions()}
                view={data =>
                    <AdvancedTable
                        className="table table-striped mx-auto"
                        columnTemplate={new BootstrapColumnTemplate()}
                        columns={transactionListColumns}
                        data={data} />}
            />
        );
    }
}