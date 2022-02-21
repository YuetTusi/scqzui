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
		background-image: linear-gradient(to right,#000000,#434343);
	}
`;

export { GlobalStyle };
