import React from 'react';
import EditUserDetailsView from './edit-user-details-view';
import { UserData } from '../../Models/model';
import { BackgroundUpdater, DefaultUpdateInterval } from '../background-updater';

export default class EditUserDetails extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <BackgroundUpdater
                enabled={false}
                initialData={new UserData()}
                fetch={() => this.props.dataAccessor.loadUserDataAsync()}
                view={data => <EditUserDetailsView userData={data} dataAccessor={this.props.dataAccessor} updateCurrentUsernameHandler={this.props.updateCurrentUsernameHandler} />} />
        );
    }
}
