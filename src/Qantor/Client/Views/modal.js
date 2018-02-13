import React from 'react';
import Styled from 'styled-components';

const StyledModal = Styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    background: #222;
    padding: 10px;
`;

const StyledBackdrop = Styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    z-index: 9998;
    background: rgba(0, 0, 0, 0.3);
`;

export default class Modal extends React.PureComponent {

    render() {
        if (this.props.isOpen === false)
            return null;

        return (
            <div>
                <StyledModal>{this.props.children}</StyledModal>
                <StyledBackdrop />
            </div>
        );
    }
}
