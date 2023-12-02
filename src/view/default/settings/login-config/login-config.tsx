import React, { FC, useEffect } from 'react';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import { Button, InputNumber, Form, message } from 'antd';
import { FormValue, LoginConfigProp } from './prop';
import { MainBox } from '../styled/sub-layout';
import { ButtonBar, FormBox } from './styled/box';
import { Split } from '@/component/style-tool';
import { LocalStoreKey } from '@/utils/local-store';

const { Item, useForm } = Form;

/**
 * 登录验证配置
 */
const LoginConfig: FC<LoginConfigProp> = () => {

    const [fromRef] = useForm<FormValue>();

    useEffect(() => {
        const { setFieldsValue } = fromRef;
        const allowCount = localStorage.getItem(LocalStoreKey.AllowCount);
        const lockMinutes = localStorage.getItem(LocalStoreKey.LockMinutes);
        const loginOverTime = localStorage.getItem(LocalStoreKey.LoginOverTime);
        setFieldsValue({
            allowCount: allowCount === null ? 5 : Number(allowCount),
            lockMinutes: lockMinutes === null ? 10 : Number(lockMinutes),
            loginOverTime: loginOverTime === null ? 30 : Number(loginOverTime)
        });
    }, []);

    const onSubmit = async () => {
        const { validateFields } = fromRef;
        message.destroy();
        try {
            const {
                allowCount,
                lockMinutes,
                loginOverTime
            } = await validateFields();
            localStorage.setItem(LocalStoreKey.AllowCount, allowCount.toString());
            localStorage.setItem(LocalStoreKey.LockMinutes, lockMinutes.toString());
            localStorage.setItem(LocalStoreKey.LoginOverTime, loginOverTime.toString());
            message.success('保存成功');
        } catch (error) {
            console.warn(error);
        }
    };

    return <MainBox>
        <ButtonBar>
            <div />
            <div>
                <Button
                    onClick={onSubmit}
                    type="primary">
                    <CheckCircleOutlined />
                    <span>保存</span>
                </Button>
            </div>
        </ButtonBar>
        <Split />
        <FormBox>
            <Form
                form={fromRef}
                layout="vertical">
                <Item
                    rules={[
                        { required: true, message: '请输入密码尝试次数' }
                    ]}
                    label="密码尝试次数"
                    name="allowCount">
                    <InputNumber
                        min={1}
                        max={5}
                        placeholder="数字，最大5次"
                        style={{ width: '100%' }} />
                </Item>
                <Item
                    rules={[
                        { required: true, message: '请输入锁定时间' }
                    ]}
                    label="锁定时间（分钟）"
                    name="lockMinutes">
                    <InputNumber
                        min={1}
                        style={{ width: '100%' }} />
                </Item>
                <Item
                    rules={[
                        { required: true, message: '请输入锁定时间' }
                    ]}
                    label="登录超时时间（分钟）"
                    name="loginOverTime">
                    <InputNumber
                        min={1}
                        style={{ width: '100%' }} />
                </Item>
            </Form>
        </FormBox>
    </MainBox>;
};

export { LoginConfig };