import { join } from 'path';
import { execFile } from 'child_process';
import { shell } from 'electron';
import React, { FC, useEffect, useState, MouseEvent } from 'react';
import { Button, Empty, Modal, message } from 'antd';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import DownloadOutlined from '@ant-design/icons/DownloadOutlined';
import QrcodeOutlined from '@ant-design/icons/QrcodeOutlined';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import { QrcodeCloudModalProp } from './prop';
import { helper } from '@/utils/helper';
import { request } from '@/utils/request';
import { QRCodeBox, TipBox } from './styled/box';
import { Tip } from './tip';

const exePath = join(helper.APP_CWD, '../tools/jsyh_tmp');
const exeName = join(exePath, 'jsyh_tmp.exe');
let timer: any = null;

/**
 * 二维码云取
 */
const QrcodeCloudModal: FC<QrcodeCloudModalProp> = ({
    visible, onCancel
}) => {

    const [qrCodeBase64, setQrcodeBase64] = useState<string>('');
    const [fetching, setFetching] = useState<boolean>(false);
    const [downloading, setDownloading] = useState<boolean>(false);

    useEffect(() => {
        if (!visible) {
            if (timer !== null) {
                clearInterval(timer);
                timer = null;
            }
        }
    }, [visible]);

    useEffect(() => {
        return () => {
            if (timer !== null) {
                clearInterval(timer);
                timer = null;
            }
        }
    }, []);

    const onFetchQrcode = () => {
        setQrcodeBase64('');
        setFetching(true);
        const child = execFile(exeName, { cwd: exePath });

        request('http://127.0.0.1:9000/api/v1/GetQRCode', 'POST')
            .then(res => {
                if (res.code === 0) {
                    console.clear();
                    console.log(res.data);
                    setQrcodeBase64('data:image/jpg;base64,' + res.data.QRcode);
                } else {
                    message.destroy();
                    message.warn('获取二维码失败');
                }
                setFetching(false);
            })
            .catch(err => {
                console.log(err);
                setFetching(false);
            });

        child.on('error', (e: Error) => {
            console.log(e);
        });
    };

    const onOkClick = async (_: MouseEvent<HTMLElement>) => {

        message.destroy();
        if (qrCodeBase64 === '') {
            message.info('请扫描二维码');
            return;
        }

        setDownloading(true);

        timer = setInterval(async () => {
            try {
                const res = await request('http://127.0.0.1:9000/api/v1/ObtainBilling', 'POST');
                if (res?.data?.result) {
                    setDownloading(false);
                    message.destroy();
                    message.success('下载成功');
                    clearInterval(timer);
                    timer = null;
                    shell.openPath(res?.data?.out_path);
                } else {
                    console.log(res);
                }
            } catch (error) {
                console.log(error);
                clearInterval(timer);
                timer = null;
            }
        }, 3000);
    };

    const onCancelClick = (_: MouseEvent<HTMLElement>) => {
        setQrcodeBase64('');
        setFetching(false);
        setDownloading(false);
        onCancel();
    }

    return <Modal
        footer={[
            <Button
                type="default"
                key="QC_0"
                onClick={onCancelClick}>
                <CloseCircleOutlined />
                <span>取消</span>
            </Button>,
            <Button
                type="primary"
                key="QC_1"
                disabled={fetching}
                onClick={() => onFetchQrcode()}>
                {fetching ? <LoadingOutlined /> : <QrcodeOutlined />}
                <span>获取二维码</span>
            </Button>,
            <Button
                type="primary"
                key="QC_2"
                disabled={fetching || downloading}
                onClick={onOkClick}>
                {downloading ? <LoadingOutlined /> : <DownloadOutlined />}
                <span>下载帐单</span>
            </Button>
        ]}
        onCancel={onCancelClick}
        visible={visible}
        centered={true}
        maskClosable={false}
        destroyOnClose={true}
        title="建设银行云取"
        width={600}>
        <TipBox>
            <Tip />
        </TipBox>
        <QRCodeBox>
            {
                qrCodeBase64 === ''
                    ? <Empty description="暂未获取二维码" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    : <img src={qrCodeBase64} width={200} height={200} />
            }
        </QRCodeBox>
    </Modal>
};

export { QrcodeCloudModal };