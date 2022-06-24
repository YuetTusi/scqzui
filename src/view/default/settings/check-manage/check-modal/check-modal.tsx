import { sep, normalize } from 'path';
import React, { FC, useEffect, useState, MouseEvent } from 'react';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Form from 'antd/lib/form';
import Switch from 'antd/lib/switch';
import Modal from 'antd/lib/modal';
import { CheckModalProp, FormValue } from './prop';
import { IP, Port } from '@/utils/regex';

const { Item, useForm } = Form;
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 }
};

/**
 * 配置框
 */
const CheckModal: FC<CheckModalProp> = ({
    visible,
    data,
    saveHandle,
    cancelHandle
}) => {
    const [isCheck, setIsCheck] = useState<boolean>(false);
    const [formRef] = useForm<FormValue>();
    useEffect(() => {
        const { setFieldsValue } = formRef;
        if (data) {
            setFieldsValue({
                ...data,
                serverPath: data.serverPath ?? sep
            });
            setIsCheck(data.isCheck ?? false);
        }
    }, [data]);

    /**
     * 开关Change
     */
    const onSwitchChange = (checked: boolean) => setIsCheck(checked);

    /**
     * 确定Click
     */
    const onSaveClick = async (event: MouseEvent<HTMLButtonElement>) => {
        const { validateFields } = formRef;
        event.preventDefault();
        try {
            const values = await validateFields();
            const serverPath =
                (values.serverPath ?? '').startsWith(sep)
                    ? normalize(values.serverPath)
                    : normalize(sep + (values.serverPath ?? ''));
            saveHandle({
                isCheck,
                ip: values.ip ?? '',
                port: values.port ?? '21',
                password: values.password ?? '',
                username: values.username ?? '',
                serverPath
            });
        } catch (error) {
            console.warn(error);
        }
    };

    /**
     * 取消Click
     */
    const onCancelClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        cancelHandle();
    };

    return <Modal
        footer={[
            <Button
                onClick={onCancelClick}
                type="default"
                key="CE_0">
                <CloseCircleOutlined />
                <span>取消</span>
            </Button>,
            <Button
                onClick={onSaveClick}
                type="primary"
                key="CE_1">
                <CheckCircleOutlined />
                <span>确定</span>
            </Button>
        ]}
        onCancel={cancelHandle}
        visible={visible}
        width={600}
        title="点验模式配置"
        centered={true}
        maskClosable={false}
        destroyOnClose={true}
        forceRender={true}
    >
        <Form form={formRef} {...formItemLayout}>
            <Item label="点验模式">
                <Switch
                    checkedChildren="开"
                    unCheckedChildren="关"
                    checked={isCheck}
                    onChange={onSwitchChange}
                />
            </Item>
            <Item
                rules={[
                    { required: isCheck, message: '请填写FTP IP' },
                    { pattern: IP, message: '请填写合法的IP地址' }
                ]}
                name="ip"
                label="FTP IP">
                <Input disabled={!isCheck} placeholder="IP地址，如：192.168.1.10" />
            </Item>
            <Item
                rules={[
                    { required: isCheck, message: '请填写FTP端口' },
                    { pattern: Port, message: '请填写合法端口号' }
                ]}
                name="port"
                label="FTP端口">
                <Input disabled={!isCheck} placeholder="数字, 0-65535" />
            </Item>
            <Item
                rules={[{ required: isCheck, message: '请填写用户名' }]}
                name="username"
                label="用户名">
                <Input disabled={!isCheck} placeholder="FTP服务器用户名" />
            </Item>
            <Item
                rules={[{ required: isCheck, message: '请填写口令' }]}
                name="password"
                label="口令">
                <Input.Password disabled={!isCheck} placeholder="FTP服务器口令" />
            </Item>
            <Item
                rules={[{ required: isCheck, message: '请填写上传目录' }]}
                name="serverPath"
                label="上传目录">
                <Input disabled={!isCheck} placeholder="上传所在目录路径" />
            </Item>
        </Form>
    </Modal>;
}

CheckModal.defaultProps = {
    visible: false,
    data: null,
    saveHandle: () => { },
    cancelHandle: () => { }
};

export default CheckModal;