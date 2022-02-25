import React, { FC, memo } from 'react';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import Modal from 'antd/lib/modal';
import Button from 'antd/lib/button';
import debugModeImg from '../images/debug/debug_mode.png';
import { UsbDebugModalBox } from './styled/style';

interface UsbDebugModalProp {
    /**
     * 是否显示
     */
    visible: boolean;
    /**
     * 确定Handle
     */
    okHandle: () => void;
}

/**
 * 提示窗，提醒用户开启USB调试
 */
const UsbDebugModal: FC<UsbDebugModalProp> = ({ visible, okHandle }) => (
    <Modal
        visible={visible}
        centered={true}
        footer={[
            <Button key="UDB_0" type="primary" onClick={() => okHandle()}>
                <CheckCircleOutlined />
                <span>确定</span>
            </Button>
        ]}
        width={1000}
        maskClosable={false}
        closable={false}>
        <UsbDebugModalBox>
            <div className="img">
                <img src={debugModeImg} />
            </div>
        </UsbDebugModalBox>
    </Modal>
);

export default memo(
    UsbDebugModal,
    (prev: UsbDebugModalProp, next: UsbDebugModalProp) => !prev.visible && !next.visible
);
