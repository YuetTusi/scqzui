import styled from 'styled-components';

const SummaryBox = styled.div`

    cursor: pointer;

    &>div{
        text-align: center;
        margin:0;
        padding:0;
        &>label{
            color:#f9ca24;
        }
        &>span{
            color:#f9ca24;
        }
    }
`;

export { SummaryBox };