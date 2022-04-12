import color2 from 'tinycolor2';
import styled from 'styled-components';

export const OfficerBox = styled.div`
    &>.button-bar{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items:center;
    }
    .police-list {
		position: absolute;
		top:62px;
		left:0;
		right:0;
		bottom:0;
		overflow-y: auto;
		padding: 0 10px;

		ul {
			margin: 0;
			padding: 0;
		}

		li {
			margin: 10px 10px 0 0;
			padding: 0;
			list-style-type: none;
			display: inline-block;
		}

		.ant-empty {
			margin: 15% auto 0 auto;
		}

		.police {
			position: relative;
			cursor: pointer;
			border-radius: ${props => props.theme['border-radius-base']};;
			background-color: ${props => props.theme['primary-color']};
			border-left: 1px solid ${props => color2(props.theme['primary-color']).darken(10).toString()};
			border-top: 1px solid ${props => color2(props.theme['primary-color']).darken(10).toString()};
			padding: 32px;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			&:hover {
				transition: ease-in 0.2s;
			}

			.avatar {
				display: block;
				width: 55px;
				height: 54px;
			}

			.info {
				display: flex;
				flex-direction: column;
				padding-top: 14px;

				span {
					display: block;
					max-width: 98px;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					padding: 5px;
					font-size: 1.4rem;
					color: #fff;
				}

				em {
					display: block;
					padding: 5px;
					font-size: 1.4rem;
					color: #fff;
					font-style: normal;
				}
			}

			.drop {
				position: absolute;
				top: 5px;
				right: 5px;
				color: #fff;

				&:hover {
					color: #fe2c2f;
				}
			}
		}
	}
`;


export const EditBox = styled.div`
    &>.button-bar{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items:center;
    }
	&>.form-box{

		&>img{
			width: 200px;
			margin-bottom: 20px;
		}

		position: absolute;
		top:62px;
		left:10px;
		bottom:10px;
		right: 10px;
		background-color: #141414;
		border-radius: ${props => props.theme['border-radius-base']};

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
`;