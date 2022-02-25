import styled from 'styled-components';

const ContentBox = styled.div`
    position: absolute;
    left: 0;
    top:0;
    right: 0;
    bottom:0;
    padding:0 10px 10px 10px;
    display:flex;
    flex-direction: column;
`;

const DevicePanel = styled.div`
    flex:1;
    display:flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: nowrap;
    padding:20px;
    background-color:#202940;
`;

export { ContentBox, DevicePanel };