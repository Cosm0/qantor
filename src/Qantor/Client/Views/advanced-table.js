import React from 'react';
import Styled from 'styled-components';
import { HorizontalSpacer, ToggleButton } from './elements';
import { Triangle } from './glyphs';

export class BootstrapColumnTemplate {
    renderCell(content) {
        return <div className="text-center">{content}</div>;
    }

    renderSortedAsc(title) {
        return (
            <HorizontalSpacer className="w-100 text-center" left="0.866em" right="0">
                <div className="d-inline-block text-primary">
                    {title}<Triangle style={{ marginLeft: "0.2em" }} orientation="top" size="0.333" sizeUnit="em" />
                </div>
            </HorizontalSpacer>);
    }

    renderSortedDesc(title) {
        return (
            <HorizontalSpacer className="w-100 text-center" left="0.866em" right="0">
                <div className="d-inline-block text-primary">
                    {title}<Triangle style={{ marginLeft: "0.2em" }} orientation="bottom" size="0.333" sizeUnit="em" />
                </div>
            </HorizontalSpacer>);
    }

    renderUnsorted(title) {
        return (<HorizontalSpacer className="w-100 text-center" left="0.866em" right="0.866em">{title}</HorizontalSpacer>);
    }
}

export class Column {
    constructor(titleElement, valueElement, selector, comparer = ((lhs, rhs) => lhs < rhs)) {
        this._titleElement = titleElement;
        this._valueElement = valueElement;
        this._selector = selector;
        this._comparer = comparer;
    }

    renderTitle() {
        return this._titleElement;
    }

    renderValue(obj) {
        return <div className="text-center">{this._valueElement(obj)}</div>;
    }
    
    compare(lhs, rhs) {
        let lhsValue = this._selector(lhs);
        let rhsValue = this._selector(rhs);
        let lhsGreater = this._comparer(rhsValue, lhsValue);
        let rhsGreater = this._comparer(lhsValue, rhsValue);
        
        if (lhsGreater === true) {
            return -1;
        } else if (rhsGreater == true) {
            return 1;
        } else {
            return 0;
        }
    }
}

export default class AdvancedTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sortColumn: 0,
            sortDesc: false
        };
    }

    render() {
        return (
            <table className={this.props.className}>
                <thead>
                    <tr>
                        {this.props.columns.map((column, columnIndex) => {
                            return (<th key={`col-${columnIndex}`}>{this.renderHeader(column, columnIndex)}</th>);
                        })}
                    </tr>
                </thead>
                <tbody>
                    {this.props.data.sort(this.getSortFunction()).map((obj, rowIndex) =>
                        <tr key={`row-${rowIndex}`}>
                            {this.props.columns.map((column, columnIndex) =>
                                <td key={`col-${columnIndex}`}>
                                    {this.props.columnTemplate.renderCell(column.renderValue(obj))}
                                </td>)}
                        </tr>)}
                </tbody>
            </table>);
    }

    renderHeader(column, columnIndex) {
        return (<ToggleButton
            onToggle={(sender, toggled) => {
                this.setState((prevState, props) => ({
                    sortColumn: columnIndex,
                    sortDesc: columnIndex === prevState.sortColumn ? !prevState.sortDesc : false
                }))
            }}
            toggled={columnIndex === this.state.sortColumn ? this.state.sortDesc : null}
            elementToggled={this.props.columnTemplate.renderSortedDesc(column.renderTitle())}
            elementUntoggled={this.props.columnTemplate.renderSortedAsc(column.renderTitle())}
            elementIndeterminate={this.props.columnTemplate.renderUnsorted(column.renderTitle())}
        />);
    }
    
    getSortFunction() {
        const column = this.props.columns.get(this.state.sortColumn);
        return this.state.sortDesc
            ? (lhs, rhs) => column.compare(lhs, rhs)
            : (lhs, rhs) => column.compare(rhs, lhs);
    }
};
