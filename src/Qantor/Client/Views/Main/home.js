import React from 'react';
import { List } from 'immutable';
import ExchangeRateListView from '../ExchangeRates/exchange-rate-list-view';
import UserAccountListView from '../UserAccounts/user-account-list-view';
import UserDetailsView from '../UserDetails/user-details-view';
import { BackgroundUpdater, DefaultUpdateInterval } from '../background-updater';
import { UserData } from '../../Models/model';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    {!this.props.dataAccessor.isAnonymous() && this.renderSpecificToCurrentUser()}
                    <div className="col">
                        <BackgroundUpdater
                            enabled={true}
                            interval={DefaultUpdateInterval}
                            initialData={List()}
                            fetch={() => this.props.dataAccessor.loadCurrentExchangeRates()}
                            view={data => <ExchangeRateListView exchangeRates={data} />}/>
                    </div>
                </div>
            </div>);
    }

    renderSpecificToCurrentUser() {
        return (
            <div className="col">
                <BackgroundUpdater
                    enabled={true}
                    interval={DefaultUpdateInterval}
                    initialData={List()}
                    fetch={() => this.props.dataAccessor.loadCurrentUserAccounts()}
                    view={data => <UserAccountListView userAccounts={data} />} />
            </div>);
    }
}
