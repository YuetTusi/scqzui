import styled from 'styled-components';

export const JigsawBox = styled.div`
    width: auto;
	display: flex;
	flex-direction: column;

	.img-panel {
		box-sizing: border-box;
		position: relative;
		& > .bg {
			position: relative;
			display: block;
		}
		.gap-box {
			position: absolute;
			left: 0;
			top: 0;
			z-index: 101;
		}
	}

	.img-slider {
		width: auto;
	}

	.slider-overwrite {
		width: auto;
		// 重写滑块样式
		// .ant-slider-handle {
		// 	border: none;
		// 	background: none;
		// 	width: 16px;
		// 	height: 16px;
		// 	display: block;
		// 	background-image: url('./images/ruler.jpg');
		// 	background-repeat: no-repeat;
		// }
	}
`;