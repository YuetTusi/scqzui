import React, { FC } from 'react';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Input from 'antd/lib/input';
import Form from 'antd/lib/form';
import { LoginState } from '@/model/default/trace-login';
import { LoginFormProp } from './prop';

const { Password } = Input;
const { Item } = Form;

const LoginForm: FC<LoginFormProp> = ({ formRef, loginState }) => <Form
    form={formRef}
    layout="vertical">
    <Row>
        <Col span={24}>
            <Item
                name="username"
                label="用户"
                rules={[{ required: true, message: '请输入用户' }]}>
                <Input
                    disabled={
                        loginState === LoginState.Busy
                        || loginState === LoginState.IsLogin
                    }
                />
            </Item>
        </Col>
    </Row>
    <Row>
        <Col span={24}>
            <Item
                name="password"
                label="密码"
                rules={[{ required: true, message: '请输入密码' }]} >
                <Password
                    disabled={
                        loginState === LoginState.Busy
                        || loginState === LoginState.IsLogin
                    }
                />
            </Item>
        </Col>
    </Row>
</Form>;

export default LoginForm;
