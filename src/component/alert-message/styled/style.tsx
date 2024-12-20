import styled from 'styled-components';

export const AlartMessageBox = styled.div`
    position: absolute;
	top: 0;
	right: 180px;
	z-index: 99;

	.alarm-message-bg {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 5px 10px;
		border-bottom-left-radius: ${props => props.theme['border-radius-base']};
		border-bottom-right-radius: ${props => props.theme['border-radius-base']};
		background-color: rgba(0, 0, 0, 0.6);
	}

	ul {
		margin: 0;
		padding: 0;
		li {
			margin: 0;
			padding: 0;
			list-style-type: none;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			& > div {
				display: flex;
				align-items: center;
				margin-bottom: 2px;
			}
		}
	}

	.alarm-message-ico {
		color: #fff;
		font-size: 2rem;
		margin-right: 5px;
		animation: flashNotice 0.6s ease-out infinite;
	}
	.alarm-message-txt {
		display: inline-block;
		max-width: 250px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: #fff;
		font-size: 1.2rem;
		animation: flashNotice 0.6s ease-out infinite;
	}

	.alarm-message-close-btn {
		color: #fff;
		cursor: pointer;
		margin-left: 5px;
	}

	@keyframes flashNotice {
		0% {
			color: #fff;
		}

		50% {
			color: #e12830;
		}
	}
`;
