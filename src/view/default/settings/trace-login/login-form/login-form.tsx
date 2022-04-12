import React, { FC } from 'react';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Input from 'antd/lib/input';
import Form from 'antd/lib/form';
import { LoginState } from '@/model/default/trace-login';
import { LoginFormProp } from './prop';

const { Password } = Input;
const { Item } = Form;

const LoginForm: FC<LoginFormProp> = ({ formRef, loginState }) => {
    return (
        <Form form={formRef} layout="vertical">
            <Row>
                <Col span={24}>
                    <Item name="username" rules={[{ required: true, message: '请输入用户' }]} label="用户">
                        <Input
                            disabled={
                                loginState === LoginState.Busy ||
                                loginState === LoginState.IsLogin
                            }
                        />
                    </Item>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Item name="password" rules={[{ required: true, message: '请输入密码' }]} label="密码">
                        <Password
                            disabled={
                                loginState === LoginState.Busy ||
                                loginState === LoginState.IsLogin
                            }
                        />
                    </Item>
                </Col>
            </Row>
        </Form >
    );
}

export default LoginForm;
