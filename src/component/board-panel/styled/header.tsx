import styled from 'styled-components';

const Header = styled.div`

    position:absolute;
    top:24px;
    left:0;
    right:0;

    display:flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: 2rem;
    font-weight: lighter;
    color:${(props => props.theme['text-color'])};
    height:50px;

    &>div{
        padding: 0 15px;
        font-size: 2rem;
    }
    .header-caption{
        margin-left: 4rem;
        &>span{
            letter-spacing: 3px;
        }
        &>em{
            cursor: pointer;
            color:${props => props.theme['primary-color']};
            padding: 0 1rem;
            font-family: Arial;
            font-style: normal;
            text-decoration: none;
        }
    }
    .header-buttons{
        .anticon{
            cursor: pointer;
            padding-left:14px;
        }
    }
`;

const BackgroundBox = styled.div`
    position: absolute;
    left:0;
    right:0;
    top:0;
    bottom:0;
    background: radial-gradient(#1285b4, #0f224d 60%);
`;

export { Header, BackgroundBox };