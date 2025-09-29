import styled from 'styled-components';

export const CleanMessageBox = styled.div`
    margin-top:20px;
    .clean-msg {
		border: 1px solid ${props => props.theme['primary-color']};
		border-radius: 3px;

		.caption {
			background-color: ${props => props.theme['primary-color']};
			color: #fff;
			border-top-left-radius: 2px;
			border-top-right-radius: 2px;
			padding: 5px 8px;
		}

		.scroll-dev {
			height: 135px;
			overflow-y: auto;
		}
		ul {
			margin: 0;
			padding: 0;
		}
		li {
			margin: 0;
			padding: 4px 5px;
			list-style-type: none;
			font-size: 1.2rem;
			&:last-child {
				border-bottom: none;
			}
			&:nth-child(2n + 1) {
				background-color: ${props => props.theme['background-color']};
			}
		}
	}
`;