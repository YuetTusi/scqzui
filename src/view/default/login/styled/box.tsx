import styled from 'styled-components';

export const LoginBox = styled.div`

    position: absolute;
    left:0;
    right:0;
    top:0;
    bottom:0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    .bg-box{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        border-radius: 3px;
        background-color: ${props => props.theme['panel-color']};
        .cap{
            font-size: 1.8rem;
            color:${props => props.theme['link-color']};
            border-bottom:1px solid ${props => props.theme['link-color']};
        }
        .form-box{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border-radius: 3px;
            width: 600px;
            height: 400px;
            padding: 20px;
            border:1px solid ${props => props.theme['panel-color']};;
            box-shadow: 0px 0px 10px 1px ${props => props.theme['background-color']};
            background-color: ${props => props.theme['background-color']};
            /* background: radial-gradient(#1285b4, #0f224d 60%); */
        }
    }
`;

