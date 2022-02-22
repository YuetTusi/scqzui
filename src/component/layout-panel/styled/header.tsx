import styled from 'styled-components';

const Header = styled.div`

    position:absolute;
    top:0;
    left:0;
    right:0;

    display:flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: 2rem;
    font-weight: lighter;
    color:#fff;
    height:50px;

    &>div{
        padding: 0 14px;
        font-size: 2rem;
    }
    .header-menu-item{
    }
    .header-buttons{
        .anticon{
            cursor: pointer;
            padding-left:14px;
        }
    }
`;

export { Header };