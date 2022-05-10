import styled from 'styled-components';

const VersionBox = styled.div`
    width: auto;
	height: 100%;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;

	.logo {
		display: block;
		width: 300px;
		height: 300px;
	}

	.info {
		width: 450px;
		margin-left: 20px;

		label {
			display: inline-block;
			white-space: nowrap;
			width: 60px;
			text-align: left;
			text-align-last: justify;
		}
		.text{
			padding-left: 10px;
			color:${props => props.theme['primary-color']};
		}

		div {
			padding: 5px 0;
		}

		ul {
			margin: 5px 0;
			padding: 0;
			list-style-position: inside;
		}

		li {
			margin: 0;
			padding: 2px 0;
			list-style-type: circle;
		}
	}
`;

const LogListBox = styled.div`
    width: auto;
	max-height: 560px;
	overflow-y: auto;

	h2 {
		font-size: 1.6rem;
		padding: 5px 12px;
		margin: 0 10px;
		border-radius: ${props => props.theme['border-radius-base']};;
		text-shadow: 1px 1px 1px #222;
		color: ${(props => props.theme['text-color'])};
		background-color: ${(props) => props.theme['primary-color']};
		& > span {
			margin-left: 1rem;
		}
	}
	label {
		display: inline-block;
		text-align: right;
		font-weight: bold;
		color: ${(props) => props.theme['primary-color']};
	}
	.details {
		font-family: Arial;
		padding: 5px 12px;
		user-select: text;
		& > div {
			display: inline;
			margin-right: 1rem;
		}
		.spe {
			margin-bottom: 0;
		}
	}
	ul {
		margin: 5px 12px;
		padding: 0;
		border-radius: ${(props) => props.theme['border-radius-base']};
		border: 1px solid #2a2a2a;
	}
	li {
		list-style-type: none;
		padding: 5px;
		color: ${(props => props.theme['text-color'])};
        border-bottom: 1px solid #2a2a2a;
		/* &:nth-child(2n + 1) {
			background-color: #181d30;
		} */
	}
`;

export { VersionBox, LogListBox }