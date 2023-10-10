import { join } from 'path';
import { execFile } from 'child_process';
import { shell } from 'electron';
import React, { FC, useEffect, useState, MouseEvent } from 'react';
import { Col, Row, Button, Empty, Input, Form, Modal, message } from 'antd';
import DownloadOutlined from '@ant-design/icons/DownloadOutlined';
import QrcodeOutlined from '@ant-design/icons/QrcodeOutlined';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import { ChinaMobileModalProp, FormValue } from './prop';
import { helper } from '@/utils/helper';
import { request } from '@/utils/request';
import { FormBox, QRCodeBox, TipBox } from './styled/box';
import { Tip } from './tip';

const formLayout = {
    labelCol: { span: 4 },
    // wrapperCol: { span: 19 }
};
const exePath = join(helper.APP_CWD, '../tools/zgyd_tmp');
const exeName = join(exePath, 'zgyd_tmp.exe');
let timer: any = null;
const { Password } = Input;
const { Item, useForm } = Form;

/**
 * 中国移动云取
 */
const ChinaMobileModal: FC<ChinaMobileModalProp> = ({
    visible, onCancel
}) => {

    const [formRef] = useForm<FormValue>();
    const [qrCodeBase64, setQrcodeBase64] = useState<string>('');
    const [validCodeBase64, setValidCodeBase64] = useState<string>('');
    const [reason, setReason] = useState<string>('');
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
        setValidCodeBase64('');
        setFetching(true);
        console.log(exePath)
        const child = execFile(exeName, { cwd: exePath });

        request('http://127.0.0.1:9001/api/v1/GetQRCode', 'POST')
            .then(res => {
                if (res.code === 0) {
                    console.clear();
                    console.log(res.data);

                    console.log(JSON.stringify(res.data));

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

    const onFetchCapacha = async () => {

        message.destroy();
        if (qrCodeBase64 === '') {
            message.info('请扫描二维码');
            return;
        }

        message.info('正在获取验证码，请等待');

        try {
            const res = await request('http://127.0.0.1:9001/api/v1/CAPTCHA', 'POST');
            setValidCodeBase64('data:image/jpg;base64,' + res.data.CAPTCHA);
        } catch (error) {
            console.log(error);
        } finally {
            // setLoading(false);
        }
    };

    const onOkClick = async (_: MouseEvent<HTMLElement>) => {

        message.destroy();
        if (qrCodeBase64 === '') {
            message.info('请扫描二维码');
            return;
        }

        try {
            const { validateFields } = formRef;

            const values = await validateFields();
            console.log(values);
            setDownloading(true);

            timer = setInterval(async () => {
                try {
                    const res = await request('http://127.0.0.1:9001/api/v1/PhoneStatement', 'POST', JSON.stringify(values));
                    console.log(res);
                    setReason(res?.data?.reason ?? '');
                    if (res?.data?.result) {
                        setDownloading(false);
                        message.destroy();
                        message.success('下载成功');
                        clearInterval(timer);
                        timer = null;
                        shell.openPath(join(helper.APP_CWD, '../tools/zgyd_tmp'));
                    }
                } catch (error) {
                    console.log(error);
                    clearInterval(timer);
                    timer = null;
                    setDownloading(false);
                }
            }, 8000);
        } catch (error) {
            console.warn(error);
        }
    };

    const onCancelClick = (_: MouseEvent<HTMLElement>) => {
        formRef.resetFields();
        setQrcodeBase64('');
        setValidCodeBase64('');
        setFetching(false);
        setDownloading(false);
        onCancel();
    }

    return <>
        <Modal
            footer={[
                <Button
                    type="primary"
                    key="CMM_1"
                    disabled={fetching}
                    onClick={() => onFetchQrcode()}>
                    {fetching ? <LoadingOutlined /> : <QrcodeOutlined />}
                    <span>获取二维码</span>
                </Button>,
                // <Button
                //     type="primary"
                //     key="CMM_2"
                //     onClick={() => { }}>
                //     {downloading ? <LoadingOutlined /> : <KeyOutlined />}
                //     <span>获取验证码</span>
                // </Button>,
                <Button
                    type="primary"
                    key="CMM_3"
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
            title="中国移动云取"
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
            <FormBox>
                <Form
                    form={formRef}
                    disabled={false}
                    layout="horizontal"
                    size="small"
                    style={{ width: '100%' }}
                    {...formLayout}
                >
                    <Item
                        label="服务密码"
                        name="servpasswd"
                        rules={[
                            { required: true, message: '请填写服务密码' }
                        ]}>
                        <Input />
                    </Item>
                    <Item
                        label="短信验证码"
                        name="smspasswd"
                        rules={[
                            { required: true, message: '请填写短信验证码' }
                        ]}>
                        <Password />
                    </Item>
                    <Row>
                        <Col span={16}>
                            <Item
                                label="验证码"
                                name="imgcode"
                                rules={[
                                    { required: true, message: '请填写验证码' }
                                ]}
                                labelCol={{ span: 6 }}>
                                <Input />
                            </Item>
                        </Col>
                        <Col span={8}>
                            <img src={validCodeBase64} style={{ marginLeft: '10px' }} />
                            <Button
                                onClick={() => onFetchCapacha()}
                                type="link"
                                style={{ marginLeft: '10px' }}>
                                获取验证码
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </FormBox>
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

export { ChinaMobileModal };