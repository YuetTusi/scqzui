import styled from 'styled-components';

const FetchInfoBox = styled.div`
    margin-top:2px;
    cursor: pointer;
    font-size: 1.2rem;
    width: 280px;
    height: 22px;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    .info-danger {
        color: #f5222d;
    }

    .info-primary {
        color: #f9ca24;
    }

    .info-default {
        color: #fff;
    }
`;

export { FetchInfoBox };