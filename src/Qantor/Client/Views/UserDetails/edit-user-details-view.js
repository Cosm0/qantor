import React from 'react';
import { withRouter } from 'react-router-dom';
import ErrorListView from '../Errors/error-list-view';

class EditUserDetailsView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            email: '',
            password: '',
            editErrors: [],
            canEdit: false
        };

        this.updateInputValue = this.updateInputValue.bind(this);
        this.onEditSubmit = this.onEditSubmit.bind(this);
        this.onResetSubmit = this.onResetSubmit.bind(this);
    }

    updateInputValue(event) {
        this.state.canEdit = true;
        const change = {};
        change[event.target.name] = event.target.value;
        this.setState(change);
    }

    async onEditSubmit(event) {
        event.preventDefault();
        const { firstName, lastName, dateOfBirth, email, password } = this.state;

        await this.props.dataAccessor.editUserData(firstName, lastName, dateOfBirth, email, password)
            .then(result => {
                if (result.errors) {
                    this.setState({
                        editErrors: result.errors
                    });
                    return;
                }
                this.props.updateCurrentUsernameHandler();
                this.props.history.push('/');
            }); 
    }

    onResetSubmit(event) {
        event.preventDefault();
        this.mapPropsToState(this.props);
    }

    mapPropsToState(props) {
        this.setState({
            firstName: props.userData.firstName,
            lastName: props.userData.lastName,
            dateOfBirth: props.userData.dateOfBirth,
            email: props.userData.email,
            password: props.userData.password
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.userData !== this.props.userData) {
            this.mapPropsToState(nextProps);
        }
    }

    render() {
        var { editErrors } = this.state;

        return (
            <div className="mx-auto">
                <form onSubmit={this.onEditSubmit}>
                    <div className="form-group">
                        <label htmlFor="firstNameInput">First name:</label>
                        <input
                            type="text"
                            value={this.state.firstName}
                            id="firstNameInput"
                            name="firstName"
                            className="form-control"
                            onChange={this.updateInputValue}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastNameInput">Last name:</label>
                        <input
                            type="text"
                            value={this.state.lastName}
                            id="lastNameInput"
                            name="lastName"
                            className="form-control"
                            onChange={this.updateInputValue}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="dateOfBirthInput">Date of birth:</label>
                        <input
                            type="date"
                            value={this.state.dateOfBirth}
                            id="dateOfBirthInput"
                            name="dateOfBirth"
                            className="form-control"
                            onChange={this.updateInputValue}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="emailInput">E-mail:</label>
                        <input
                            type="text"
                            disabled="true"
                            value={this.state.email}
                            id="emailInput"
                            name="email"
                            className="form-control"
                            onChange={this.updateInputValue}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="passwordInput">Password:</label>
                        <input
                            type="password"
                            disabled="true"
                            value={this.state.password}
                            id="passwordInput"
                            name="password"
                            className="form-control"
                            onChange={this.updateInputValue}/>
                    </div>
                    <div className="d-inline-block py-1">
                        <input type="submit" value="Submit" className="btn btn-primary" onClick={this.onEditSubmit} disabled={!this.state.canEdit} />
                    </div>
                    <div className="d-inline-block py-1 px-2">
                        <input type="submit" value="Reset" className="btn btn-danger" onClick={this.onResetSubmit} disabled={!this.state.canEdit} />
                    </div>
                </form>
                <ErrorListView>{this.state.editErrors}</ErrorListView>
            </div>
        );
    }
}

export default withRouter(EditUserDetailsView);
