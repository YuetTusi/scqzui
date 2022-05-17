import QRCode from 'qrcode';
import { IpcRendererEvent } from 'electron';
import React, { FC, useEffect, useState } from 'react';
import CheckCircleFilled from '@ant-design/icons/CheckCircleFilled';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import Spin from 'antd/lib/spin';
import message from 'antd/lib/message';
import { useSubscribe } from '@/hook';
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

    const [scanned, setScanned] = useState<boolean>(false);

    useEffect(() => {
        if (visible) {
            console.log(ip);
            (async () => {
                try {
                    const target = document.getElementById('downApk');
                    await QRCode.toCanvas(target, `http://${ip}:9900/check/-1`, {
                        width: 320,
                        margin: 2,
                        color: {
                            light: '#181d30',
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

    /**
     * 扫描二维码完成响应
     * @param finish 扫码完成
     */
    const quickScannedHandle = (event: IpcRendererEvent, finish: boolean) => {
        setScanned(finish);
        setTimeout(() => {
            setScanned(false);
        }, 3000);
    };

    useSubscribe('quick-scanned', quickScannedHandle);

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
            <Spin
                spinning={scanned}
                indicator={<CheckCircleFilled style={{ color: '#52c41a' }} />}
                tip={<span style={{ color: '#52c41a' }}>扫码成功</span>}
            >
                <canvas width="320" height="320" id="downApk" />
            </Spin>
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