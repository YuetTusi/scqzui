import React, { FC, memo } from 'react';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import Tabs from 'antd/lib/tabs';
import { GuideImage } from '@/schema/guide-image';
import { HelpModalBox } from './styled/style';
import huaweiBackup from '../images/fetch/huawei_backup.jpg';
import meizuBackup from '../images/fetch/meizu_backup.jpg';
import oppoBackup from '../images/fetch/oppo_backup.jpg';
import oppoWiFi from '../images/fetch/oppo_wifi.jpg';
import vivoBackup from '../images/fetch/vivo_backup.jpg';
import vivoDev from '../images/fetch/vivo_dev.jpg';
import miBackup from '../images/fetch/mi_backup.jpg';
import oneplusBackup from '../images/fetch/oneplus_backup.jpg';
import oneplusWiFi from '../images/fetch/oneplus_wifi.jpg';
import blacksharkBackup from '../images/fetch/blackshark_backup.jpg';
import { Prop } from './prop';

const { TabPane } = Tabs;

/**
 * 帮助提示框
 */
const HelpModal: FC<Prop> = ({ visible, defaultTab, okHandle }) => <Modal
	visible={visible}
	footer={[
		<Button
			key="B_0"
			type="primary"
			onClick={() => {
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
		<Tabs defaultActiveKey={defaultTab} tabPosition="left">
			<TabPane tab="小米" key={GuideImage.MiBackup}>
				<div className="flow">
					<img src={miBackup} />
				</div>
			</TabPane>
			<TabPane tab="华为" key={GuideImage.HuaweiBackup}>
				<div className="flow">
					<img src={huaweiBackup} />
				</div>
			</TabPane>
			<TabPane tab="OPPO" key={GuideImage.OppoBackup}>
				<div className="flow">
					<img src={oppoBackup} />
				</div>
			</TabPane>
			<TabPane tab="OPPO WiFi" key={GuideImage.OppoWifi}>
				<div className="flow">
					<img src={oppoWiFi} />
				</div>
			</TabPane>
			<TabPane tab="VIVO" key={GuideImage.VivoBackup}>
				<div className="flow">
					<img src={vivoBackup} />
				</div>
			</TabPane>
			<TabPane tab="VIVO开发者模式" key={GuideImage.VivoDev}>
				<div className="flow">
					<img src={vivoDev} />
				</div>
			</TabPane>
			<TabPane tab="一加" key={GuideImage.OneplusBackup}>
				<div className="flow">
					<img src={oneplusBackup} />
				</div>
			</TabPane>
			<TabPane tab="一加 WiFi" key={GuideImage.OneplusWifi}>
				<div className="flow">
					<img src={oneplusWiFi} />
				</div>
			</TabPane>
			<TabPane tab="魅族" key={GuideImage.MeizuBackup}>
				<div className="flow">
					<img src={meizuBackup} />
				</div>
			</TabPane>
			<TabPane tab="黑鲨" key={GuideImage.BlacksharkBackup}>
				<div className="flow">
					<img src={blacksharkBackup} />
				</div>
			</TabPane>
		</Tabs>
	</HelpModalBox>
</Modal>;

HelpModal.defaultProps = {
	visible: false,
	defaultTab: 'mi',
	cancelHandle: () => { }
};

export default memo(HelpModal, (prev: Prop, next: Prop) => !prev.visible && !next.visible);
