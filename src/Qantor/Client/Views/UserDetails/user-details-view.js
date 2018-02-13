import React from 'react';
import { withRouter } from 'react-router-dom';

class UserDetailsView extends React.PureComponent {
    constructor(props) {
        super(props);
        this.onEditClick = this.onEditClick.bind(this);
    }

    onEditClick(event) {
        event.preventDefault();
        this.props.history.push('/edit');
    }

    render() {
        return (
            <div className="user-details mx-auto">
                <table className="table mx-auto">
                    <tbody>
                    <tr>
                        <td className="table-key">First name:</td>
                        <td className="table-value">{this.props.userData.firstName}</td>
                    </tr>
                    <tr>
                        <td className="table-key">Last name:</td>
                        <td className="table-value">{this.props.userData.lastName}</td>
                    </tr>
                    <tr>
                        <td className="table-key">DateOfBirth</td>
                        <td className="table-value">{this.props.userData.dateOfBirth}</td>
                    </tr>
                    <tr>
                        <td className="table-key">E-mail address:</td>
                        <td className="table-value">{this.props.userData.email}</td>
                    </tr>
                    <tr>
                        <td className="table-key">Password:</td>
                        <td className="table-value" password={this.props.userData.password}>{this.props.userData.password.replace(/./g, '*')}</td>
                    </tr>
                    </tbody>
                </table>
                <div className="text-right">
                    <button className="btn btn-primary" onClick={this.onEditClick}>Edit</button>
                </div>
            </div>
        );
    }
}

export default withRouter(UserDetailsView);