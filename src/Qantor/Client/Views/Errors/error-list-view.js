import React from 'react';

export default class ErrorListView extends React.Component {
    render() {
        const children = React.Children.toArray(this.props.children);
        if (children.length > 0) {
            return (
                <div className="edit-errors" className="card mt-4">
                    <div className="card-body p-0 bg-white">
                        <h4 className="card-title p-2 m-0 bg-danger">Error(s)</h4>
                        <div className="card-text p-2 m-0">
                            {children.map((child, index) => <div key={`error-${index}`} className="text-danger">{child}</div>)}
                        </div>
                    </div>
                </div>);
        }

        return null;
    }
};
