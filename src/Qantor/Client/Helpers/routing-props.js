import React from 'react';

const AddPropsToRoute = (WrappedComponent, passedProps) => {
    return (
        class Route extends React.Component {
            render() {
                let props = Object.assign({}, this.props, passedProps);
                return <WrappedComponent {...props} />;
            }
        }
    )
}

export default AddPropsToRoute