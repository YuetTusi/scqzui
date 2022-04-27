import styled from 'styled-components';

export const TrailBox = styled.div`
    position: absolute;
    top:0;
    left:10px;
    bottom: 10px;
    right: 10px;
    overflow-y: auto;
    border-radius: ${(props) => props.theme['border-radius-base']};
    background-color: #202940;
`;

export const ButtonBar = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding:10px 10px 0 10px;
`;

export const ListBox = styled.div`
    position: relative;
    border-radius: ${props => props.theme['border-radius-base']};
    border:1px solid #303030;
    display: flex;
    flex-direction: column;
    margin:10px;

    &>.title{
        flex:none;
        color:#fff;
        padding: 5px 5px;
        border-top-left-radius: ${props => props.theme['border-radius-base']};
        border-top-right-radius: ${props => props.theme['border-radius-base']};
        background-color: ${props => props.theme['primary-color']};
    }
    &>.panel{
        padding: 10px;
        background-color: #141414;
    }
`;

export const InstallList = styled.div`
    width: 100%;
    border: 1px solid #303030;
    border-radius: ${props => props.theme['border-radius-base']};
    position: relative;
    height: 440px;
    overflow-y: auto;
    ul,
    li {
        margin: 0;
        padding: 0;
    }
    li {
        padding: 5px 10px;
        border-bottom: 1px solid #303030;
        list-style-type: none;
        /* &:nth-child(odd) {
            background-color: #fbfbfb;
        } */
    }
`;

export const EmptyBox = styled.div`

    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px 0;
`;

export const TrailChartBox = styled.div`
	width: 100%;
	height: 440px;
	display: flex;
	flex-direction: row;
	.chart-box {
		flex: 3;
		width: auto;
		height: 440px;
	}
	.list-box {
		flex: 2;
		width: auto;
        margin-left: 10px;

		.list-panel {
			height: 440px;
			border: 1px solid #303030;
			border-radius: ${props => props.theme['border-radius-base']};
			position: relative;
			.caption {
                color:#fff;
				padding: 6px;
                border-top-left-radius: ${props => props.theme['border-radius-base']};
                border-top-right-radius: ${props => props.theme['border-radius-base']};
				background-color: #303030;
			}
			.list {
				position: absolute;
				top: 40px;
				left: 0;
				right: 0;
				bottom: 0;
				overflow-y: auto;
				ul,
				li {
					margin: 0;
					padding: 0;
				}
				li {
					padding: 5px 10px;
					border-bottom: 1px solid #303030;
					list-style-type: none;
				}
				& > .ant-empty {
					margin-top: 33%;
				}
			}
		}
	}
`;