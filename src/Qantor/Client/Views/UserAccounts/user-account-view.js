import React from 'react';

export default class UserAccountView extends React.Component {
    render() {
        return (
            <tr>
                <th scope="row">{this.props.userAccount.currency}</th>
                <td>{this.props.userAccount.balance.toFixed(2)}</td>
            </tr>);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !this.props.userAccount.equals(nextProps.userAccount);
    }
};
