import styled from 'styled-components';

const AppSelectModalBox = styled.div`

    width: auto;

    .center-box {
        height: 420px;
        overflow: auto;
        padding-bottom: 20px;
        .no-data-place {
            margin-top: 33%;
        }
    }

    .cloud-center-box {
        height: 420px;
        overflow: auto;
        padding-bottom: 20px;
        .no-data-place {
            margin-top: 33%;
        }
    }
    
    .tip-msg {
        margin: 5px 15px;
        &:empty {
            margin: 0;
        }
        fieldset {
            display: block;
            border: 1px solid #303030;
            border-radius: ${props => props.theme['border-radius-base']};
            legend {
                width: auto;
                margin-left: 10px;
                font-size: 12px;
                font-weight: normal;
            }
            ul {
                font-size: 12px;
                font-family: 'Arial';
                margin: 0;
                padding: 0 5px 5px 5px;
            }
            li {
                margin: 0 0 0 20px;
                padding: 0;
                color:${(props) => props.theme['primary-color']};
                list-style-type: square;
                em {
                    font-style: normal;
                    color: red;
                }
            }
        }
    }
`;

export { AppSelectModalBox };