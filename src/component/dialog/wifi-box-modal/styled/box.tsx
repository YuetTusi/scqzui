import styled from 'styled-components';

export const StepsBox = styled.div`

    display:flex;
    flex-direction:row;
    justify-content:center;
    align-items:flex-start;

    .step{
        flex:none;
        padding:5px;
    }
    .explain{
        flex:1;
        display:flex;
        flex-direction:column;
        height:650px;
        border-left: 1px solid ${props => props.theme['mode'] === 'dark' ? '#303030' : props.theme['background-color']};
        .text{
            flex:none;
            padding:5px 20px;
            text-align:center;
            font-weight:bold;
        }
        .image-box{
            flex:1;
            display:flex;
            flex-direction:row;
            justify-content:center;
            align-items:center;
            width:auto;
            height:576px;

            img{
                max-width:1080px;
                max-height:580px;
            }
        }
    }
`;