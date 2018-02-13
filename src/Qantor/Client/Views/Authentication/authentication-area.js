import React from 'react';
import { Redirect } from 'react-router-dom';
import { authMode } from '../../Helpers/authentication-mode';
import { fetchJson } from '../../fetch';
import ErrorListView from '../Errors/error-list-view';
import WarningText from './warning-text';
import Modal from '../modal';

export default class AuthenticationArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: '',
            lastname: '',
            dateOfBirth: '',
            email: '',
            password: '',
            confirmPassword: '',
            authenticationErrors: [],
            redirectTo: '',
            shouldRedirect: false,
            isModalOpen: true
        };

        this.onAuthenticationSubmit = this.onAuthenticationSubmit.bind(this);
        this.handleChangeFor = this.handleChangeFor.bind(this);
        this.onModalClose = this.onModalClose.bind(this);
    }

    componentWillMount() {
        this.checkAuthentication();
    }

    checkAuthentication() {
        const { history } = this.props;
        if (this.props.auth.isAuthenticated()) {
            history.replace({ pathname: '/' });
        }
    }

    handleChangeFor(event) {
        const change = {};
        change[event.target.name] = event.target.value;
        this.setState(change);
    }

    async onAuthenticationSubmit(event) {
        event.preventDefault();
        if (this.props.mode === authMode.Login) {
            await this.login();
        }
        if (this.props.mode === authMode.Register) {
            await this.register();
        }
    }

    async login() {
        const { email, password } = this.state;

        if (email && password) {
            const result = await fetchJson('/users/authenticate', 'POST', { email, password });
            if (result.token) {
                this.props.auth.startSession(result.token, result.id);
                this.props.updateCurrentUsernameHandler();
                this.setState({
                    shouldRedirect: true,
                    redirectTo: this.props.location.state || { from: { pathname: '/' } }
                });
            } else {
                this.setState({ authenticationErrors: [result.message] });
            }
        } else {
            this.setState({ authenticationErrors: ['Fill all fields'] });
        }
    }

    async register() {
        const { firstname, lastname, dateOfBirth, email, password, confirmPassword } = this.state;
        let authenticationErrors = [];

        if (!firstname || !lastname || !email || !password || !confirmPassword) {
            authenticationErrors.push('Please fill all fields.');
        }

        if (password) {
            if(password !== confirmPassword) {
                authenticationErrors.push('Passwords do not match.');
            }

            if (password.length < 8) {
                authenticationErrors.push('Password must contain at least 8 characters.');
            }

            let regex = /[0-9]/;
            if (!regex.test(password)) {
                authenticationErrors.push('Password must contain at least one number (0-9).');
            }

            regex = /[a-z]/;
            if (!regex.test(password)) {
                authenticationErrors.push('Password must contain at least one lowercase letter (a-z).');
            }

            regex = /[A-Z]/;
            if (!regex.test(password)) {
                authenticationErrors.push('Password must contain at least one uppercase letter (A-Z).');
            }

            regex = /[!@#\$%\^&]/;
            if (!regex.test(password)) {
                authenticationErrors.push('Password must contain at least one special character (!@#\$%\^&).');
            }
        }

        if (authenticationErrors.length > 0) {
            this.setState({ authenticationErrors: authenticationErrors });
        } else {
            await fetchJson('/users/register', 'POST', { firstname, lastname, dateOfBirth, email, password })
                .then(result => {
                    if (result.errors) {
                        this.setState({
                            authenticationErrors: result.errors
                        });
                        return;
                    }
                    alert('Registration successful. Please log into your account.');
                    this.setState({ shouldRedirect: true, redirectTo: '/login' });
                });
        }
    }

    async onModalClose() {
        this.setState({ isModalOpen: false });
    }

    render() {
        const { shouldRedirect, redirectTo } = this.state;

        if (shouldRedirect) {
            return (
                <Redirect to={redirectTo}/>
            );
        }

        return (
            <div className="container authentication-area">
                <h2>{this.props.mode === authMode.Register ? 'Register' : 'Login'}</h2>
                {this.props.mode === authMode.Register &&
                    <div className="form-group">
                        <label>Firstname:</label>
                        <input
                            type="text"
                            name="firstname"
                            className="form-control"
                            onChange={this.handleChangeFor} />
                    </div>}
                {this.props.mode === authMode.Register &&
                    <div className="form-group">
                        <label>Lastname:</label>
                        <input
                            type="text"
                            name="lastname"
                            className="form-control"
                            onChange={this.handleChangeFor} />
                    </div>}
                {this.props.mode === authMode.Register &&
                    <div className="form-group">
                        <label>Date of birth:</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            className="form-control w-75"
                            onChange={this.handleChangeFor} />
                    </div>}
                <div className="form-group">
                    <label>Email:</label>
                    <input type="text" name="email" className="form-control" onChange={this.handleChangeFor}/>
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input type="password" name="password" className="form-control" onChange={this.handleChangeFor}/>
                </div>
                {
                    this.props.mode === authMode.Register &&
                        <div className="form-group">
                            <label>Confirm password:</label>
                            <input type="password" name="confirmPassword" className="form-control" onChange={this.handleChangeFor}/>
                        </div>
                }
                <button className="btn btn-primary" onClick={this.onAuthenticationSubmit}>Submit</button>
                <ErrorListView>{this.state.authenticationErrors}</ErrorListView>
                {
                    this.props.mode === authMode.Register &&
                        <Modal isOpen={this.state.isModalOpen} >
                        <WarningText>QAntor is an application for recruitment purposes. Please do not provide your real first and last name.</WarningText>
                        <p style={{ textAlign: 'center'}}>
                            <button onClick={this.onModalClose}>Close</button>
                        </p>
                        </Modal>
                }
            </div>
        );
    }
};