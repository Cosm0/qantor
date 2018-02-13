import React from 'react';
import UserDetailsView from './user-details-view';
import { UserData } from '../../Models/model';
import { BackgroundUpdater, DefaultUpdateInterval } from '../background-updater';

export default class UserDetails extends React.Component {
    render() {
        return (
            <BackgroundUpdater
                enabled={false}
                initialData={new UserData()}
                fetch={() => this.props.dataAccessor.loadUserDataAsync()}
                view={data => <UserDetailsView userData={data} />} />);
    }
}
