import styled from 'styled-components';

const AppleCreditBox = styled.div`
    hr {
        border-top   : none;
        border-bottom: 1px soild #d6d6d6;
    }

    .title {
        font-size  : 18px;
        font-weight: bolder;
    }

    .content {
        display        : flex;
        flex-direction : column;
        justify-content: center;
        align-items    : center;

        h3 {
            color      : ${(props) => props.theme['primary-color']};
            font-weight: bolder;
        }

        img {
            width        : 277px;
            height       : 500px;
            border       : 1px solid #e8e8e8;
            border-radius: 5px;
            padding      : 5px;
        }
    }
`;

export { AppleCreditBox }