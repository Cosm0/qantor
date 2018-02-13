import Styled from 'styled-components';

const getTriangleHeight = function (props) {
    return props.size.toString() + props.sizeUnit;
};

const getTriangleWidth = function (props, base) {
    return base === true ? (parseFloat(props.size) * 1.732).toString() + props.sizeUnit : 0;
}

export const Triangle = Styled.div`
    width: 0;
    height: 0;
    display: inline-block;
    border-left: ${props => getTriangleHeight(props)} solid transparent;
    border-right: ${props => getTriangleHeight(props)} solid transparent;
    border-top: ${props => getTriangleWidth(props, props.orientation === 'bottom')} solid ${props => props.color};
    border-bottom: ${props => getTriangleWidth(props, props.orientation === 'top')} solid ${props => props.color};
`;
