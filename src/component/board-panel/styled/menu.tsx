import styled from 'styled-components';

const MenuBox = styled.ul`
    margin:-12px -16px;
    padding: 0;
    
    &>li{
        cursor: pointer;
        margin:0;
        padding: 10px 20px;
        list-style-type: none;
        border-bottom: 1px solid #303030;
        &>span{
            margin-left: 10px;
        }
        &:hover{
            color:${props => props.theme['primary-color']};
        }
    }
`;

export { MenuBox };  