import styled from 'styled-components';

const AppleCreditBox = styled.div`
    hr {
        border-top   : none;
        border-bottom: 1px soild #303030;
    }

    .title {
        font-size  : 18px;
        padding: 20px 10px 10px 20px;
    }

    .content {
        display        : flex;
        flex-direction : column;
        justify-content: center;
        align-items    : center;
        padding: 5px;

        h3 {
            color      : ${(props) => props.theme['primary-color']};
            font-weight: bolder;
        }

        img {
            width        : 277px;
            height       : 500px;
            border       : 1px solid #303030;
            border-radius: ${props => props.theme['border-radius-base']};
            padding      : 5px;
        }
    }
`;

export { AppleCreditBox }