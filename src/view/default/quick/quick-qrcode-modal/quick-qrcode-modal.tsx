
import QRCode from 'qrcode';
import React, { FC, useEffect } from 'react';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import message from 'antd/lib/message';
import { QuickQRCodeModalBox } from './styled/style';
import { QuickQRcodeModalProp } from './prop';

/**
 * 快速点验扫码框
 */
const QuickQRCodeModal: FC<QuickQRcodeModalProp> = ({
    visible,
    ip,
    cancelHandle
}) => {

    useEffect(() => {
        if (visible) {
            console.log(ip);
            (async () => {
                try {
                    const target = document.getElementById('downApk');
                    await QRCode.toCanvas(target, `http://${ip}:9900/check`, {
                        width: 320,
                        margin: 2,
                        color: {
                            light: '#141414',
                            dark: '#ffffffd9'
                        }
                    });
                } catch (error) {
                    console.log(error);
                    message.warn('创建二维码失败');
                }
            })();
        }
    }, [visible]);

    return <Modal
        footer={[
            <Button
                onClick={cancelHandle}
                type="default"
                key="QQM_0">
                <CloseCircleOutlined />
                <span>取消</span>
            </Button>
        ]}
        onCancel={cancelHandle}
        visible={visible}
        centered={true}
        forceRender={true}
        destroyOnClose={true}
        maskClosable={false}
        title="扫码点验">
        <QuickQRCodeModalBox>
            <p>将设备连接至采集盒子或者无线热点后，打开浏览器扫码下载</p>
            <canvas width="320" height="320" id="downApk" />
        </QuickQRCodeModalBox>
    </Modal>
};

QuickQRCodeModal.defaultProps = {
    visible: false,
    ip: '127.0.0.1',
    cancelHandle: () => { }
};

export { QuickQRcodeModalProp };
export default QuickQRCodeModal;