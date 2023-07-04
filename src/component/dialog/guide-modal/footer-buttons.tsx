import React, { FC } from 'react';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import { helper } from '@/utils/helper';
import { FooterButtonsProp } from './prop';

/**
 * GuideModal框按钮
 */
const FooterButtons: FC<FooterButtonsProp> = ({
	device, yesHandle, noHandle
}) => {
	let buttons: JSX.Element[] = [];

	if (!helper.isNullOrUndefined(device?.tipNoButton)) {
		buttons.push(
			<Button
				onClick={() => {
					if (device?.tipNoButton?.confirm) {
						Modal.confirm({
							content: device.tipNoButton?.confirm,
							onOk() {
								noHandle(device.tipNoButton?.value, device);
							},
							okText: '是',
							cancelText: '否',
							centered: true
						});
					} else {
						noHandle(device?.tipNoButton?.value, device!);
					}
				}}
				key="NoButton"
				type="default">
				{device?.tipNoButton?.name}
			</Button>
		);
	}
	if (!helper.isNullOrUndefined(device?.tipYesButton)) {
		buttons.push(
			<Button
				onClick={() => {
					if (device?.tipYesButton?.confirm) {
						Modal.confirm({
							content: device.tipYesButton?.confirm,
							onOk() {
								yesHandle(device.tipYesButton?.value, device);
							},
							okText: '是',
							cancelText: '否',
							centered: true
						});
					} else {
						yesHandle(device?.tipYesButton?.value, device!);
					}
				}}
				key="YesButton"
				type="primary">
				{device?.tipYesButton?.name}
			</Button>
		);
	}
	if (buttons.length === 0) {
		return null;
	} else {
		return <>{buttons}</>;
	}
};

export default FooterButtons;
