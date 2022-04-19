import React, { FC, useState } from 'react';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Modal from 'antd/lib/modal';
import { ApplePasswordModalBox } from './styled/style';
import { ApplePasswordModalProp } from './prop';

/**
 * iTunes
 * @param props
 */
const ApplePasswordModal: FC<ApplePasswordModalProp> = ({
	visible,
	device,
	closeHandle,
	confirmHandle,
	cancelHandle,
	withoutPasswordHandle
}) => {
	const [password, setPassword] = useState<string>('');

	return (
		<Modal
			visible={visible}
			footer={[
				<Button
					type="default"
					key="APM_0"
					onClick={() => {
						cancelHandle(device?.usb);
						setPassword('');
					}}>
					未知密码放弃
				</Button>,
				<Button
					type="primary"
					key="APM_1"
					onClick={() => {
						withoutPasswordHandle(device?.usb);
						setPassword('');
					}}>
					未知密码继续
				</Button>
			]}
			onCancel={closeHandle}
			title="iTunes备份密码确认"
			centered={true}
			destroyOnClose={true}
			forceRender={true}
			maskClosable={false}
			closable={true}>
			<ApplePasswordModalBox>
				<div className="control">
					<label>密码：</label>
					<div className="widget">
						<Input onChange={(e) => setPassword(e.target.value)} value={password} />
						<Button
							type="primary"
							onClick={() => {
								confirmHandle(password, device?.usb);
								setPassword('');
							}}>
							确定
						</Button>
					</div>
				</div>
			</ApplePasswordModalBox>

		</Modal>
	);
};

ApplePasswordModal.defaultProps = {
	visible: false,
	confirmHandle: () => { },
	withoutPasswordHandle: () => { },
	cancelHandle: () => { },
	closeHandle: () => { }
};

export default ApplePasswordModal;
