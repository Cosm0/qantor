import React from 'react';
import UserAccountView from './user-account-view';

export default class UserAccountListView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <table className="table table-striped user-account-list-view bg-light mx-auto">
                <thead>
                <tr>
                    <th>Currency</th>
                    <th>Balance</th>
                </tr>
                </thead>
                <tbody>
                    {this.props.userAccounts.map(userAccount =>
                        <UserAccountView
                            key={userAccount.currency}
                            userAccount={userAccount} />)}
                </tbody>
            </table>);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !this.props.userAccounts.equals(nextProps.userAccounts);
    }
};
