import styled from 'styled-components';


const GuideModalBox = styled.div`

    .flow {
        max-height: 680px;
        overflow-y: auto;

        img {
            display: block;
            width  : 100%;
            padding: 5px;
        }
    }

    .text {
        display       : flex;
        flex-direction: row;
        padding       : 20px;
    }
`;


export { GuideModalBox };