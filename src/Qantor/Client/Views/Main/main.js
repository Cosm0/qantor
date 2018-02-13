import React from 'react';
import { Link, Route, Switch, withRouter } from 'react-router-dom';
import { authMode } from '../../Helpers/authentication-mode';
import AddPropsToRoute from '../../Helpers/routing-props';
import AuthenticationArea from '../Authentication/authentication-area';
import DataAccessor from '../../Services/data-accessor';
import MainHeader from './main-header';
import MainFooter from './main-footer';
import Pane from './pane';
import Home from './home';
import Wallet from '../UserWallet/user-wallet';
import TransactionList from '../Transactions/transaction-list';
import EditUserDetails from '../UserDetails/edit-user-details';
import UserDetails from '../UserDetails/user-details';

class MainMenuItem extends React.PureComponent {
    render() {
        return <a className="main-menu-item nav-link font-weight-bold pointer-area" onClick={this.props.onRedirect}>{this.props.children}</a>;
    }
}

class MainMenu extends React.PureComponent {
    render() {
        return (
            <nav className="navbar navbar-expand-sm navbar-light p-0">
                <ul className="navbar-nav mr-auto">
                    {this.props.children.map((child, index) => <li key={`nav-item-${index}`} className="nav-item">{child}</li>)}
                </ul>
            </nav>);
    }
}

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedUserName: ''
        };

        this.dataAccessor = new DataAccessor(this.props.auth);
        this.updateCurrentUsernameHandler = this.updateCurrentUsernameHandler.bind(this);
        this.setCurrentUserData();
    }

    updateCurrentUsernameHandler() {
        this.setCurrentUserData();
    }

    setCurrentUserData() {
        this.dataAccessor.loadUserDataAsync()
            .then(result => this.setState({ loggedUserName: `${result.firstName} ${result.lastName}` }));
    }

    logout() {
        this.props.auth.endSession();
        this.props.history.push('/');
    }

    render() {
        return (
            <div className="container-fluid">
                <Pane>{this.renderHeaderForCurrentUser()}</Pane>
                <Pane>
                    <MainMenu>{this.renderAuthenticationSpecific()}</MainMenu>
                </Pane>
                <Pane>
                    <Switch>
                        <Route exact path="/" component={AddPropsToRoute(Home, { dataAccessor: this.dataAccessor })}/>
                        <Route path="/login" component={AddPropsToRoute(AuthenticationArea,
                            {
                                auth: this.props.auth,
                                mode: authMode.Login,
                                updateCurrentUsernameHandler: this.updateCurrentUsernameHandler
                            })}/>
                        <Route path="/register" component={AddPropsToRoute(AuthenticationArea,
                            {
                                auth: this.props.auth,
                                mode: authMode.Register
                            })} />
                        <Route path="/wallet" component={AddPropsToRoute(Wallet, { dataAccessor: this.dataAccessor })}/>
                        <Route path="/transactions" component={AddPropsToRoute(TransactionList, { dataAccessor: this.dataAccessor })}/>
                        <Route path="/account" component={AddPropsToRoute(UserDetails, { dataAccessor: this.dataAccessor })}/>
                        <Route path="/edit" component={AddPropsToRoute(EditUserDetails,
                            {
                                dataAccessor: this.dataAccessor,
                                updateCurrentUsernameHandler: this.updateCurrentUsernameHandler
                            })}/>
                    </Switch>
                </Pane>
                <Pane>
                    <MainFooter/>
                </Pane>
            </div>
        );
    }

    renderAuthenticationSpecific() {
        const linkHome = <MainMenuItem key="link-home" onRedirect={() => this.redirect('/')}>Home</MainMenuItem>;

        if (this.props.auth.isAuthenticated() === true) {
            return [
                linkHome,
                <MainMenuItem key="link-wallet" onRedirect={() => this.redirect("/wallet")}>Wallet</MainMenuItem>,
                <MainMenuItem key="link-transactions" onRedirect={() => this.redirect("/transactions")}>Transactions</MainMenuItem>,
                <MainMenuItem key="link-account" onRedirect={() => this.redirect("/account")}>My account</MainMenuItem>,
                <MainMenuItem key="link-logout" onRedirect={this.logout.bind(this)}>Log out</MainMenuItem>
            ];
        } else {
            return [
                linkHome,
                <MainMenuItem key="link-login" onRedirect={() => this.redirect("/login")}>Login</MainMenuItem>,
                <MainMenuItem key="link-register" onRedirect={() => this.redirect("/register")}>Register</MainMenuItem>
            ];
        }
    }

    renderHeaderForCurrentUser() {
        return this.dataAccessor.isAnonymous() ? <MainHeader/> : <MainHeader userName={this.state.loggedUserName}/>;
    }

    redirect(path) {
        this.props.history.push(path);
    }
};

export default withRouter(Main);