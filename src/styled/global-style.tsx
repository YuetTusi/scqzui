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

    // 滚动条整体宽度
    ::-webkit-scrollbar {
        width: 8px;
    }// 滚动条滑槽样式
    ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        border-radius: 8px;
    }// 滚动条样式
    ::-webkit-scrollbar-thumb {
        border-radius: 8px;
        background: #ddd;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
    }
    ::-webkit-scrollbar-thumb:hover{
        background: #ccc;
    }
    ::-webkit-scrollbar-thumb:active{
        background: #999;
    }// 浏览器失焦的样式
    ::-webkit-scrollbar-thumb:window-inactive {
        background: #c1c1c1;
    }
`;

export { GlobalStyle };
