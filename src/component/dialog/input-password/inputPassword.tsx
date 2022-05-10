import React from 'react';
import LockOutlined from '@ant-design/icons/LockOutlined';
import notification from 'antd/lib/notification';
import logger from '@/utils/log';
import { getDb } from '@/utils/db';
import { DeviceType } from '@/schema/device-type';
import { TableName } from '@/schema/table-name';
import PasswordInput from './PasswordInput';
import { DatapassParam, OkHandle } from './prop';
import { DescBox } from './styled/style';

/**
 * 提示用户确认密码
 * 以notification呈献，全局消息
 */
const inputPassword = (params: DatapassParam, callback: OkHandle) => {
	let desc: JSX.Element = <></>;
	const db = getDb<DeviceType>(TableName.Device);

	db.findOne({ _id: params.deviceId })
		.then(data => {
			const { mobileName = '' } = data;
			desc = (
				<DescBox>
					<div>导入「{mobileName.split('_')[0]}」数据请输入备份密码（<em>空密码为取消导入</em>）：</div>
				</DescBox>
			);
		})
		.catch(err => {
			logger.error(
				`未查询到第三方导入手机名称 @/component/dialog/InputPassword: ${err.message}`
			);
			desc = (
				<DescBox>
					<div>导入数据请输入备份密码（<em>空密码为取消导入</em>）：</div>
				</DescBox>
			);
		})
		.then(() => {
			notification.info({
				key: `pwd-confirm-${params.deviceId}`,
				message: '密码确认',
				description: desc,
				duration: null,
				icon: <LockOutlined style={{ color: '#f3ac22' }} />,
				btn: (
					<PasswordInput
						params={params}
						okHandle={callback}
						notificationId={`pwd-confirm-${params.deviceId}`}
					/>
				),
				onClose: () => callback(params, true, '')
			});
		});
};

export { inputPassword };
