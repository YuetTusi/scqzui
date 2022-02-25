import React, { FC } from 'react';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import { helper } from '@/utils/helper';
import { FooterButtonsProp } from './prop';

/**
 * GuideModal框按钮
 */
const FooterButtons: FC<FooterButtonsProp> = (props) => {
	const { device } = props;

	let buttons: JSX.Element[] = [];

	if (!helper.isNullOrUndefined(device.tipNoButton)) {
		buttons.push(
			<Button
				onClick={() => {
					if (device.tipNoButton?.confirm) {
						Modal.confirm({
							content: device.tipNoButton?.confirm,
							onOk() {
								props.noHandle(device.tipNoButton?.value, device);
							},
							okText: '是',
							cancelText: '否',
							centered: true
						});
					} else {
						props.noHandle(device.tipNoButton?.value, device);
					}
				}}
				type="default">
				{device.tipNoButton?.name}
			</Button>
		);
	}
	if (!helper.isNullOrUndefined(device.tipYesButton)) {
		buttons.push(
			<Button
				onClick={() => {
					if (device.tipYesButton?.confirm) {
						Modal.confirm({
							content: device.tipYesButton?.confirm,
							onOk() {
								props.yesHandle(device.tipYesButton?.value, device);
							},
							okText: '是',
							cancelText: '否',
							centered: true
						});
					} else {
						props.yesHandle(device.tipYesButton?.value, device);
					}
				}}
				type="primary">
				{device.tipYesButton?.name}
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
