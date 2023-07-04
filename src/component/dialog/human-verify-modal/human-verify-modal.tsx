import React, { FC } from 'react';
import { useDispatch } from 'dva';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import message from 'antd/lib/message';
import { send } from '@/utils/tcp-server';
import { CommandType, SocketType } from '@/schema/command';
import { HumanVerify } from '@/schema/human-verify';
import JigsawCheck from './jigsaw-check';
// import WordSelect from '../WordSelect';
import { Prop } from './prop';

/**
 * 图形验证码弹框
 * @param props
 * @returns
 */
const HumanVerifyModal: FC<Prop> = ({
	visible,
	usb,
	appId,
	title,
	humanVerifyData,
	closeHandle
}) => {

	const dispatch = useDispatch();

	/**
	 * 拼图handle
	 * @param value 值
	 */
	const onPiece = (value: number) => {

		send(SocketType.Fetch, {
			type: SocketType.Fetch,
			cmd: CommandType.HumanReply,
			msg: {
				usb,
				appId,
				value
			}
		});
		message.info('验证结果已发送...');
		dispatch({
			type: 'cloudCodeModal/setHumanVerifyData',
			payload: {
				usb,
				m_strID: appId,
				humanVerifyData: null
			}
		});
		setTimeout(() => {
			closeHandle();
		}, 500);
	};
	/**
	 * 选字handle
	 * @param values 坐标值
	 */
	// const onValid = (
	// 	values: {
	// 		x: number;
	// 		y: number;
	// 	}[]
	// ) => {
	// 	send(SocketType.Fetch, {
	// 		type: SocketType.Fetch,
	// 		cmd: CommandType.HumanReply,
	// 		msg: {
	// 			usb,
	// 			appId,
	// 			value: values
	// 		}
	// 	});
	// 	message.info('验证结果已发送...');
	// 	setTimeout(() => {
	// 		closeHandle();
	// 	}, 500);
	// };

	const renderByType = (verifyData: HumanVerify | null) => {
		if (verifyData === null) {
			return null;
		} else {
			switch (verifyData.type) {
				case 'ARTIFICIAL_BLOCK_PUZZLE':
					return <JigsawCheck
						bgSrc={verifyData.back_img.base64}
						gapSrc={verifyData.jigsaw_img.base64}
						bgWidth={verifyData.back_img.width}
						bgHeight={verifyData.back_img.height}
						gapWidth={verifyData.jigsaw_img.width}
						gapHeight={verifyData.jigsaw_img.height}
						gapInitStyle={verifyData.jigsaw_img.style}
						onPiece={onPiece}
					/>;
				// case 'ARTIFICIAL_CLICK_WORD':
				// 	return (
				// 		<WordSelect
				// 			src={verifyData.back_img.base64}
				// 			width={verifyData.back_img.width}
				// 			height={verifyData.back_img.height}
				// 			size={3}
				// 			onValid={onValid}>
				// 			{verifyData.tips.check}
				// 		</WordSelect>
				// 	);
				default:
					return null;
			}
		}
	};

	return <Modal
		visible={visible}
		width={humanVerifyData?.back_img.width! + 48}
		footer={[
			<Button onClick={() => closeHandle()} type="default" key="HV_0">
				<CloseCircleOutlined />
				<span>取消</span>
			</Button>
		]}
		title={title}
		centered={true}
		maskClosable={false}
		closable={false}>
		{renderByType(humanVerifyData)}
	</Modal>;
};

export default HumanVerifyModal;
