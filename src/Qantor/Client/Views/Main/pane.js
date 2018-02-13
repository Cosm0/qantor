import React from 'react';
import Styled from 'styled-components';

export default class Pane extends React.Component {
    render() {
        return (
            <div className="card card-default rounded" style={{ marginTop: '0.5em', opacity: 0.8 }}>
                <div className="card-body">{this.props.children}</div>
            </div>);
    }
};
