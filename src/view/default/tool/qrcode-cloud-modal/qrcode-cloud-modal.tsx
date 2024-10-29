import { join } from 'path';
import { shell } from 'electron';
import React, { FC, useEffect, useState, MouseEvent } from 'react';
import { Button, Empty, Modal, message } from 'antd';
import DownloadOutlined from '@ant-design/icons/DownloadOutlined';
import QrcodeOutlined from '@ant-design/icons/QrcodeOutlined';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import { QrcodeCloudModalProp } from './prop';
import { helper } from '@/utils/helper';
import { request } from '@/utils/request';
import { QRCodeBox, TipBox } from './styled/box';
import { Tip } from './tip';

let timer: any = null;

/**
 * 二维码云取
 */
const QrcodeCloudModal: FC<QrcodeCloudModalProp> = ({
    visible, onCancel
}) => {

    const [qrCodeBase64, setQrcodeBase64] = useState<string>('');
    const [fetching, setFetching] = useState<boolean>(false);
    const [reason, setReason] = useState<string>('');
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

    const onFetchQrcode = async () => {
        setQrcodeBase64('');
        setFetching(true);
        // try {
        //     await request('http://127.0.0.1:9000/api/v1/Exit', 'POST');
        // } catch (error) {
        //     console.log(error.message);
        // }

        setTimeout(() => {
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
        }, 5000);
    };

    const onOkClick = async (_: MouseEvent<HTMLElement>) => {

        message.destroy();
        if (qrCodeBase64 === '') {
            message.info('请扫描二维码');
            return;
        }

        setDownloading(true);

        try {
            const res = await request('http://127.0.0.1:9000/api/v1/ObtainBilling', 'POST');
            setReason(res?.data?.reason ?? '');
            console.log(res);
            if (res?.data?.result) {
                setDownloading(false);
                message.destroy();
                message.success('下载成功');
                clearInterval(timer);
                timer = null;
                shell.openPath(res?.data?.out_path);
            }
        } catch (error) {
            console.log(error);
            clearInterval(timer);
            timer = null;
        }
    };

    const onCancelClick = async (_: MouseEvent<HTMLElement>) => {
        try {
            await request('http://127.0.0.1:9000/api/v1/Exit', 'POST');
        } catch (error) {
            console.log(error.message);
        }
        setQrcodeBase64('');
        setFetching(false);
        setDownloading(false);
        onCancel();
    }

    return <>
        <Modal
            footer={[
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
        <Modal
            onCancel={() => {
                if (timer !== null) {
                    clearInterval(timer);
                    timer = null;
                }
                setDownloading(false);
            }}
            title="下载"
            visible={downloading}
            confirmLoading={downloading}
            okButtonProps={{ disabled: downloading }}
            closable={false}
            centered={true}
            okText="确定"
            cancelText="取消">
            <p>{helper.isNullOrUndefinedOrEmptyString(reason) ? '正在下载帐单，请稍等' : reason}</p>
        </Modal>
    </>
};

export { QrcodeCloudModal };