import styled from 'styled-components';

const FetchInfoBox = styled.div`
    cursor: pointer;
    font-size: 1.2rem;
    width: 280px;
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