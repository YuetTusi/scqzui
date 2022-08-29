import React, { FC, memo } from 'react';
import Empty from 'antd/lib/empty';
import Modal from 'antd/lib/modal';
import { helper } from '@/utils/helper';
import { getImages } from './get-images';
import FooterButtons from './footer-buttons';
import { GuideModalBox } from './styled/style';
import { GuideModalProp } from './prop';

const { max } = helper.readConf()!;

/**
 * 提示消息引导图示框
 * @param props
 */
const GuideModal: FC<GuideModalProp> = (props) => {
	const { device, visible, cancelHandle, yesHandle, noHandle } = props;

	/**
	 * 渲染内容区
	 */
	const renderContent = (): JSX.Element | string => {
		if (helper.isNullOrUndefinedOrEmptyString(device?.tipContent)) {
			//图示消息
			let imgPath = getImages(device?.tipImage!);
			if (imgPath === null) {
				return <div className="flow">
					<Empty description="暂无图示" />
				</div>;
			} else {
				return <div className="flow">
					<img src={imgPath} />
				</div>;
			}
		} else {
			//文本消息
			return <div className="text">{device?.tipContent}</div>;
		}
	};

	/**
	 * 获取宽度
	 */
	const getWidth = () => {
		if (helper.isNullOrUndefinedOrEmptyString(device?.tipContent)) {
			return max <= 2 ? 1020 : 1220;
		} else {
			return 400;
		}
	};

	return <Modal
		visible={visible}
		title={device?.tipTitle}
		onCancel={cancelHandle}
		footer={<FooterButtons {...props} yesHandle={yesHandle} noHandle={noHandle} />}
		width={getWidth()}
		centered={true}
		destroyOnClose={true}
		maskClosable={false}
		closable={true}>
		<GuideModalBox>
			{renderContent()}
		</GuideModalBox>
	</Modal>;
};

GuideModal.defaultProps = {
	visible: false,
	device: {},
	yesHandle: () => { },
	noHandle: () => { },
	cancelHandle: () => { }
};

export default memo(GuideModal, (prev: GuideModalProp, next: GuideModalProp) => !prev.visible && !next.visible);
