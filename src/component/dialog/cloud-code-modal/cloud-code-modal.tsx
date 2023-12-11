import { ipcRenderer } from 'electron';
import React, { FC, useState } from 'react';
import { useSelector } from 'dva';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import Button from 'antd/lib/button';
import Empty from 'antd/lib/empty';
import Modal from 'antd/lib/modal';
import { StateTree } from '@/type/model';
import { HumanVerify } from '@/schema/human-verify';
import { AppSetStore } from '@/model/default/app-set';
import { CloudCodeModalStoreState } from '@/model/default/cloud-code-modal';
import HumanVerifyModal from '../human-verify-modal/human-verify-modal';
import { CloudCodeModalBox } from './styled/style';
import CodeItem from './code-item';
import { Prop } from './prop';


/**
 * 云取证验证证码/密码输入框
 */
const CloudCodeModal: FC<Prop> = ({ cancelHandle }) => {

	const appSet = useSelector<StateTree, AppSetStore>(state => state.appSet);
	const {
		usb,
		mobileHolder = '云取进度',
		mobileNumber = '...',
		devices,
		visible
	} = useSelector<StateTree, CloudCodeModalStoreState>(state => state.cloudCodeModal);

	const currentDevice = devices[usb - 1];

	const [humanVerifyData, setHumanVerifyData] = useState<HumanVerify | null>(null);
	const [appId, setAppId] = useState('');
	const [appDesc, setAppDesc] = useState('');

	const renderItem = () => {
		if (currentDevice?.apps && currentDevice.apps.length > 0) {
			return currentDevice.apps.map((app, i) => <CodeItem
				app={app}
				usb={usb}
				humanVerifyDataHandle={(data, isUrl, appId, appDesc) => {
					console.log(appId);
					console.log(appDesc);
					console.log(`isUrl:${isUrl}`);
					console.log(data);
					if (isUrl) {
						ipcRenderer.send('show-image-verify', data as string);
					} else {
						setHumanVerifyData(data as HumanVerify);
					}
					setAppId(appId);
					setAppDesc(appDesc);
				}}
				cloudApps={appSet.cloudAppData}
				key={`K_${i}`}
			/>);
		} else {
			return <Empty description="暂无云取应用" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
		}
	};

	return <>
		<Modal
			footer={[
				<Button onClick={cancelHandle} key="CLOUD_0">
					<CloseCircleOutlined />
					<span>取消</span>
				</Button>
			]}
			visible={visible}
			onCancel={cancelHandle}
			width={800}
			title={`${mobileHolder}（${mobileNumber}）`}
			centered={true}
			destroyOnClose={true}
			forceRender={true}
			maskClosable={false}
			className="zero-padding-body">
			<CloudCodeModalBox>
				<div className="scroll-item">{renderItem()}</div>
			</CloudCodeModalBox>
		</Modal>
		<HumanVerifyModal
			visible={humanVerifyData !== null}
			usb={usb}
			appId={appId}
			title={`${appDesc}-请滑动正确拼合图片`}
			humanVerifyData={humanVerifyData}
			closeHandle={() => {
				setHumanVerifyData(null);
			}}
		/>
	</>;
};

CloudCodeModal.defaultProps = {
	cancelHandle: () => { }
};

export default CloudCodeModal;
