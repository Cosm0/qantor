import React from 'react';

export const DefaultUpdateInterval = 5000;

export class BackgroundUpdater extends React.Component {
    constructor(props) {
        super(props);
        this.invalidate = this.invalidate.bind(this);
        this.handler = null;
        this.state = { data: this.props.initialData };
        this.shouldSetState = false;
        this.fetchData();
    }

    render() {
        return this.props.view(this.state.data);
    }

    componentDidMount() {
        this.mounted = true;
        this.handler = setInterval(this.invalidate, this.props.interval);
    }
    
    componentWillMount() {
        this.shouldSetState = true;
    }

    componentWillUnmount() {
        this.shouldSetState = false;
        if (this.handler !== null) {
            clearInterval(this.handler);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.handler !== null) {
            clearInterval(this.handler);
        }

        this.handler = setInterval(this.invalidate, nextProps.interval);
    }

    invalidate() {
        if (this.props.enabled) {
            this.fetchData();
        }
    }

    fetchData() {
        this.props.fetch().then(newData => {
            if (this.shouldSetState) {
                this.setState((prevState, props) => ({ data: newData }));
            } else {
                this.state = { data: newData };
            }
        });
    }
};
