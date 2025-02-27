import React, { FC } from 'react';
import { useDispatch, useSelector } from 'dva';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import Tabs from 'antd/lib/tabs';
import { GuideImage } from '@/schema/guide-image';
import { StateTree } from '@/type/model';
import { HelpModalState } from '@/model/default/help-modal';
import { HelpModalBox } from './styled/style';
import { Prop, tabItems } from './prop';

/**
 * 帮助提示框
 */
const HelpModal: FC<Prop> = ({ okHandle }) => {

	const dispatch = useDispatch();
	const {
		open,
		manufacturer
	} = useSelector<StateTree, HelpModalState>(state => state.helpModal);

	/**
	 * 设备厂商返回对应的图片Key
	 */
	const manuToImage = (manu: string): string => {
		let img = '';
		const m = manu.toLocaleLowerCase();

		switch (m) {
			case 'oppo':
				img = GuideImage.OppoWifi;
				break;
			case 'oneplus':
				img = GuideImage.OneplusWifi;
				break;
			default:
				for (let i of Object.values(GuideImage)) {
					if (i.includes(manu.toLocaleLowerCase())) {
						img = i;
						break;
					}
				}
				break;
		}
		return img;
	};

	/**
	 * 选项卡Change
	 */
	const onTabChange = (activeKey: string) =>
		dispatch({ type: 'helpModal/setManufacturer', payload: activeKey });

	return <Modal
		open={open}
		footer={[
			<Button
				key="HPM_0"
				type="primary"
				onClick={() => {
					dispatch({ type: 'helpModal/setManufacturer', payload: '' });
					okHandle!();
				}}>
				<CheckCircleOutlined />
				<span>确定</span>
			</Button>
		]}
		width={1240}
		title="操作帮助"
		closable={false}
		destroyOnClose={true}
		maskClosable={false}
		centered={true}
		className="zero-padding-body">
		<HelpModalBox>
			<Tabs
				onChange={onTabChange}
				activeKey={manuToImage(manufacturer)}
				items={tabItems}
				defaultActiveKey="mi"
				tabPosition="left">
			</Tabs>
		</HelpModalBox>
	</Modal>;
};

HelpModal.defaultProps = {
	cancelHandle: () => { }
};

export default HelpModal;
