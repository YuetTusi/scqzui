import styled from 'styled-components';
import { darken, lighten } from 'polished';

export const ToolBox = styled.div`
    position: absolute;
    top:0;
    left:10px;
    right:10px;
    bottom:10px;
    padding:10px;
    overflow-y: auto;
    border-radius: ${props => props.theme['border-radius-base']};
    background-color: ${props => props.theme['panel-color']};
`;

export const SortBox = styled.div`

    padding: 10px 10px 0 10px;
    margin-bottom: 10px;
    border-radius: ${props => props.theme['border-radius-base']};
    background-color: ${props => props.theme['background-color']};

    &:last-child{
        margin-bottom: 0;
    }

    &>.caption{
        /* color:${props => props.theme['primary-color']}; */
    }

    .t-row{
        display: flex;
        flex-wrap:wrap;
        padding-bottom: 0;
    }

    .t-button{
        cursor: pointer;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
        width: 122px;
        height: 114px;
        padding: 10px 10px;
        margin-right: 10px;
        margin-bottom: 10px;
        background-color: ${props => props.theme['background-color']};
        border:1px solid ${props => props.theme['mode'] === 'dark'
        ? lighten(0.1, props.theme['panel-color'])
        : darken(0.1, props.theme['panel-color'])
    };
        border-radius: ${props => props.theme['border-radius-base']};
        &.reverse{
            //反转颜色
            &>.ico{
                filter: invert(1);
            }
        }
        &:hover{
            transition: .2s;
            transform: scale(1.05);
            box-shadow:0px 0px 9px 1px ${props => props.theme['primary-color']};
            border:1px solid ${props => props.theme['primary-color']};
            background-color: ${props => lighten(0.1, props.theme['panel-color'])};
            &>.name{
                transition: .2s;
                color:${props => props.theme['primary-color']};
            }
        }
        &>.ico{
            font-size: 5rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        &>.name{
            width: 110px;
            text-align: center;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            font-size:1.2rem;
        }
    }
`;