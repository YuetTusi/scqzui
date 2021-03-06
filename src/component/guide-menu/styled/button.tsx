import styled from 'styled-components';
import color2 from 'tinycolor2';

/**
 * 纯色按钮
 */
const Color = styled.div<{ color: string }>`
    cursor: pointer;
    color:#fff;
    width:350px;
    height:100%;
    border-radius: ${props => props.theme['border-radius-base']};
    background-image: linear-gradient(${(props) => props.color},${(props) => color2(props.color).darken(3).toString()});
    display: flex;
    flex-direction: column;

    &:hover{
        background-image: linear-gradient(${(props) => color2(props.color).darken(3).toString()},${(props) => color2(props.color).darken(10).toString()});
    }

    &>a{
        flex: 1;
        display:flex;
        flex-direction: column;
        justify-content:center;
        align-items:center;
        font-size: 2rem;
        color:#fff;
        .icon-box{
            font-size: 8rem;
        }
        .text-box{
            padding-top:1rem;
            letter-spacing: 2px;
        }
    }
`;

/**
 * 图像按钮
 */
const Image = styled.div`
    cursor: pointer;
    box-sizing: border-box;
    color:#fff;
    width:100%;
    height:100%;
    border-radius: ${props => props.theme['border-radius-base']};

    .push-img{
        position: relative;
        display:block;
        border-radius: ${props => props.theme['border-radius-base']};
        width:100%;
        height:100%;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        

        &>a{
            position: absolute;
            bottom:30px;
            left:0;
            right:0;
            display: flex;
            flex-direction: row;
            justify-content:center;
            align-items: center;
            width: 100%;
            font-size: 2rem;
            color:#fff;
            .icon-box{
                
            }
            .text-box{
                letter-spacing: 2px;
                padding-left:1rem;
            }
        }

        &>.desc-mask{
            position: absolute;
            background-color:rgba(34,34,34,0.8);
            color:#fff;
            top: 0;
            left:0;
            right:0;
            bottom: 0;
            z-index: 1;
            box-sizing: border-box;
            display:none;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: hidden;

            &>ul{
                margin:0;
                padding:0;
            }
            &>ul>li{
                margin:0;
                padding:5px 0;
                font-size: 1.4rem;
                font-weight: lighter;
            }

            &.open{
                display:flex;
                animation: show 0.2s linear;
            }
        }
    }

    @keyframes show {
        from{
            display:flex;
            width:0%;
            opacity: 0%;
        }
        to{ 
            display:flex;
            width:100%;
            opacity: 100%;
        }
    }
`;

export { Color, Image };