import styled from 'styled-components';
import color2 from 'tinycolor2';

const MenuPanel = styled.menu`
    margin:0;
    padding:0 15px;
    width:220px;
    height:100%;
    /* background-color: rgb(24,29,48,.94); */
    background-color: #2b3347;

    .sub-title{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height:55px;
        color:#a9afbbd1;
        font-size: 1.6rem;
        text-align: center;
        border-bottom: 1px solid #a9afbbd1;
    }

    & > ul{
        margin:0;
        padding:0;
        & > li{
            margin:10px 0 0 0 ;
            padding:0;
            list-style-type: none;
            & > a{
                border-radius: 2px;
                padding: 12px 15px;
                display:block;
                color:#a9afbbd1;
                &.active{
                    background-color: ${(props) => props.theme['primary-color']};
                    color:${(props => props.theme['text-color'])};
                }
                & > div{
                    display: flex;
                    flex-direction: row;
                    justify-content: start;
                    align-items: center;
                }
            }
            .ico{
                display: inline-block;
            }
            .name{
                margin-left: 1rem;
                vertical-align: middle;
            }
        }
    }
`;

export { MenuPanel }