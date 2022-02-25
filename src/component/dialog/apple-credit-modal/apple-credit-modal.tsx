import React, { FC, memo } from 'react';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import debugImg from './images/debug.jpg';
import { AppleCreditBox } from './styled/style';

interface Prop {
	visible: boolean;
	okHandle?: () => void;
}

/**
 * Apple信任提示框
 * @param props
 */
const AppleCreditModal: FC<Prop> = ({ visible, okHandle }) => {
	return (
		<Modal
			visible={visible}
			footer={[
				<Button
					key="ACB_0"
					type="primary"
					onClick={() => {
						if (okHandle) {
							okHandle();
						}
					}}>
					<CheckCircleOutlined />
					<span>确定</span>
				</Button>
			]}
			centered={true}
			maskClosable={false}
			closable={false}
			width={500}>
			<AppleCreditBox>
				<div className="title">信任授权</div>
				<hr />
				<div className="content">
					<h3>请点击屏幕上的信任按钮</h3>
					<img src={debugImg} alt="iPhone信任" />
				</div>
			</AppleCreditBox>
		</Modal>
	);
};

export default memo(AppleCreditModal, (prev: Prop, next: Prop) => !prev.visible && !next.visible);
