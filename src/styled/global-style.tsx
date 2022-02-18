import { createGlobalStyle } from 'styled-components';

/**
 * 定义全局样式
 */
const GlobalStyle = createGlobalStyle`

    html{
        margin:0;
        padding:0;
        font-size: 62.5%;
        height: 100%;
    }
    body{
        margin:0;
        padding:0;
        height: 100%;
        font-size: 1.4rem;
        background-image: linear-gradient(#232526,#414345);
    }
    #root{
        margin:0;
        padding:0;
        width:auto;
        height:100%;
        background-color: red;
        position: relative;
    }
`;

export { GlobalStyle };
