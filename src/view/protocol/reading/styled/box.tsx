import styled from 'styled-components';

export const AtPanel = styled.div`

    box-sizing: border-box;
    margin: 0;
    padding: 10px;
    height: 100%;
    overflow-y: auto;
    border: 1px solid #303030;

    h3 {
        margin-top: 20px;
        padding: 10px;
        font-size: 2rem;
        font-weight: bold;
        font-family: NSimSun;
        text-align: center;
    }
    .article {
        padding: 10px;
        line-height: 2rem;
        font-size: 1.2rem;
        font-family: NSimSun;
    }
    .footer-button {
        margin-top: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        &>{
            .ant-btn:first-child{
                margin-right: 10px;
            }
        }
    }
`;