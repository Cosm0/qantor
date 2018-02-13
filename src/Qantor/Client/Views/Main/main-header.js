import React from 'react';

export default class MainHeader extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div id="main-title" className="text-left text-bold">
                            <span className="text-danger font-weight-bold">QA</span><span className="text-info">ntor</span>
                        </div>
                        <div className="text-left font-weight-light font-italic">Your real-time money exchange centre</div>
                    </div>
                    <div className="col-md-auto text-right">{this.props.userName}</div>
                </div>
            </div>);
    }
};
