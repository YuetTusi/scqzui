import React, { FC, useEffect } from 'react';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import QRCode from 'qrcode';
import { Col, Row, Button, message, Modal } from 'antd';
import { DownloadBrowserProp } from './prop';

/**
 * 下载花瓣浏览器扫码框
 */
const DownloadBrowser: FC<DownloadBrowserProp> = ({ open, ip, cancelHandle }) => {

    useEffect(() => {
        if (open) {
            (async () => {
                try {
                    const target = document.getElementById('hiCloudBrowser');
                    console.clear();
                    console.log(target);
                    await QRCode.toCanvas(target, `http://${ip}:9900/download-browser`, {
                        width: 300,
                        margin: 1,
                        color: {
                            light: '#ffffff',
                            dark: '#181d30'
                        }
                    });
                } catch (error) {
                    console.log(error);
                    message.warn('创建二维码失败');
                }
            })();
        }
    }, [open]);

    return <Modal
        footer={[
            <Button
                onClick={cancelHandle}
                type="default"
                key="DB_0">
                <CloseCircleOutlined />
                <span>取消</span>
            </Button>
        ]}
        onCancel={cancelHandle}
        open={open}
        width={360}
        title="下载花瓣浏览器"
        maskClosable={false}
        centered={true}
        forceRender={true}
        destroyOnClose={true}>
        <Row align="middle" justify="center">
            <Col>
                <canvas width="260" height="260" id="hiCloudBrowser" />
            </Col>
        </Row>
    </Modal>
};


export { DownloadBrowser };