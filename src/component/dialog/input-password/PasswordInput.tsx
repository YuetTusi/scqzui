import React, { FC, useRef } from 'react';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import notification from 'antd/lib/notification';
import { PasswordPanel } from './styled/style';
import { DatapassParam, OkHandle } from './prop';

interface Prop {
	/**
	 * 通告组件id
	 */
	notificationId: string;
	/**
	 * 后台传回的参数（导入的手机）
	 */
	params: DatapassParam;
	/**
	 * 确认handle
	 */
	okHandle: OkHandle;
}

/**
 * 密码输入组件
 */
const PasswordInput: FC<Prop> = ({ params, notificationId, okHandle }) => {
	const inputRef = useRef<any>();

	return <PasswordPanel>
		<Input ref={inputRef} size="small" placeholder="请输入备份密码" />
		<Button
			type="primary"
			size="small"
			onClick={() => {
				okHandle(params, false, inputRef.current.input.value);
				notification.close(notificationId);
			}}>
			<CheckCircleOutlined />
		</Button>
	</PasswordPanel>;
};

export default PasswordInput;
