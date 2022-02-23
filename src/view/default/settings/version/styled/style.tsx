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
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 1.4rem;
		/* color: @base-font-color; */
		font-family: 'Arial';
		width: 420px;
		height: 300px;
		margin-left: 30px;

		label {
			display: inline-block;
			width: 75px;
			text-align: justify;
			text-align-last: justify;
			/* color: @base-font-color; */

			&:after {
				content: '：';
			}
		}

		div {
			width: 100%;
			padding: 5px 0;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
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
		border-radius: 2px;
		text-shadow: 1px 1px 1px #222;
		color: #fff;
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
		color: #fff;
        border-bottom: 1px solid #2a2a2a;
		/* &:nth-child(2n + 1) {
			background-color: #181d30;
		} */
	}
`;

export { VersionBox, LogListBox }