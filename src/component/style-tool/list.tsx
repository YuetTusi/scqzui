import styled from 'styled-components';

/**
 * 无序列表
 */
export const UnorderList = styled.ul`
    margin: 0;
    padding:0;
    font-size: 1.4rem;

    li{
        list-style-type: square;
        list-style-position: inside;
        padding: 2px 0;
        em{
            padding: 0 1px;
            text-decoration: none;
            font-style: normal;
            font-weight: normal;
            color:#0fb9b1;
        }
        strong{
            padding: 0 1px;
            text-decoration: none;
            font-style: normal;
            font-weight: normal;
            color:#db2222;
        }
    }
`;