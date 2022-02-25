import { createGlobalStyle } from 'styled-components';

/**
 * 定义全局样式
 */
const GlobalStyle = createGlobalStyle`

    html{
        font-size: 62.5%;
        height: 100%;
    }
    body{
        height: 100%;
        font-size: 1.4rem;
		font-family:"Microsoft Yahei","NSimSun","Arial";
    }
	#root{
		position: relative;
		width:auto;
		height: 100%;
        background-color: #181d30;
		/* background-image: linear-gradient(to right,#181d30,#181d30); */
	}

    //Webkit滚动条样式
    ::-webkit-scrollbar {
        width: 8px;
    }
    ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        border-radius: 2px;
    }
    ::-webkit-scrollbar-thumb {
        border-radius: 2px;
        background: #ddd;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
    }
    ::-webkit-scrollbar-thumb:hover{
        background: #ccc;
    }
    ::-webkit-scrollbar-thumb:active{
        background: #999;
    }
    ::-webkit-scrollbar-thumb:window-inactive {
        background: #c1c1c1;
    }

    //悬停动画
    /* Sweep To Right */
    .hvr-sweep-to-right {
        display: inline-block;
        vertical-align: middle;
        -webkit-transform: perspective(1px) translateZ(0);
        transform: perspective(1px) translateZ(0);
        box-shadow: 0 0 1px rgba(0, 0, 0, 0);
        position: relative;
        -webkit-transition-property: color;
        transition-property: color;
        -webkit-transition-duration: 0.3s;
        transition-duration: 0.3s;
    }
    .hvr-sweep-to-right:before {
        content: "";
        position: absolute;
        z-index: -1;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #0fb9b1;
        border-radius: 2px;
        -webkit-transform: scaleX(0);
        transform: scaleX(0);
        -webkit-transform-origin: 0 50%;
        transform-origin: 0 50%;
        -webkit-transition-property: transform;
        transition-property: transform;
        -webkit-transition-duration: 0.3s;
        transition-duration: 0.3s;
        -webkit-transition-timing-function: ease-out;
        transition-timing-function: ease-out;
    }
    .hvr-sweep-to-right:hover, .hvr-sweep-to-right:focus, .hvr-sweep-to-right:active {
        color: white;
    }
    .hvr-sweep-to-right:hover:before, .hvr-sweep-to-right:focus:before, .hvr-sweep-to-right:active:before {
        -webkit-transform: scaleX(1);
        transform: scaleX(1);
    }

    //重写Modal
    .zero-padding-body {
        .ant-modal-body {
            padding: 0 !important;
        }
    }

`;

export { GlobalStyle };
