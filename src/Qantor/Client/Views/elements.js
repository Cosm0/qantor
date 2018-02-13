import React from 'react';
import Styled from 'styled-components';

export const PropsHolder = Styled.div`
    display: inline-block;
    width: 100%;
`;

export const HorizontalSpacer = Styled.div`
    display: inline-block;
    padding-top: 0;
    padding-bottom: 0;
    padding-left: ${props => props.left};
    padding-right: ${props => props.right};
`;

export class DropdownList extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { selectedIndex: 0 };
    }

    render() {
        const { id, children, selectedIndex, onSelectionChanged, ...otherProps } = this.props;

        const childArray = React.Children.toArray(children);
        const buttonId = `${this.props.id}-button`;

        return (
            <div id={this.props.id} className="dropdown container-fluid px-0">
                <button
                    className="btn btn-primary dropdown-toggle container-fluid text-left"
                    type="button"
                    id={buttonId}
                    data-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false">
                    {childArray[this.state.selectedIndex]}
                </button>
                <div className="dropdown-menu container-fluid" aria-labelledby={buttonId}>
                    {childArray.map((child, index) => <a className="dropdown-item pointer-area" key={`item-${index}`} onClick={() => this.selectItem(index)}>{child}</a>)}
                </div>
            </div>);
    }

    get value() {
        return this.state.selectedIndex;
    }

    componentDidUpdate() {
        this.props.onSelectionChanged(this);
    }
    
    selectItem(index) {
        if (index !== this.state.selectedIndex) {
            this.setState({ selectedIndex: index });
        };
    }
}

export class ToggleButton extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    render() {
        return (
            <div className="pointer-area" onClick={this.handleClick}>
                {this.props.toggled === true
                    ? this.props.elementToggled
                    : this.props.toggled === false
                    ? this.props.elementUntoggled
                    : this.props.elementIndeterminate }
            </div>
        );
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.toggled !== nextProps.toggled;
    }

    handleClick() {
        this.props.onToggle(this, this.props.toggled === null ? true : !this.props.toggled);
    }
}
