import React, { FC, MouseEvent } from 'react';
import { routerRedux, useDispatch } from 'dva';
import KeyOutlined from '@ant-design/icons/KeyOutlined';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Form from 'antd/lib/form';
import Button from 'antd/lib/button';
import message from 'antd/lib/message';
import { LoginBox } from './styled/box';
import { FormValue, LoginProp } from './prop';
import Input from 'antd/lib/input';

const { Item, useForm } = Form;
const { Password } = Input;

/**
 * 用户登录
 */
const Login: FC<LoginProp> = () => {
    const dispatch = useDispatch();
    const [formRef] = useForm<FormValue>();

    const loginSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
        const { validateFields } = formRef;
        e.preventDefault();
        try {
            const { userName, password } = await validateFields();
            if (userName === 'azwx' && password === 'azwx') {
                message.success('登录成功');
                dispatch(routerRedux.push('/guide'));
            } else {
                message.destroy();
                message.warn('登录失败，用户名或密码不正确');
            }
        } catch (error) {
            console.warn(error);
        }
    };

    return <LoginBox>
        <div className="bg-box">
            <div className="form-box">
                <p className="cap">
                    用户登录
                </p>
                <Form form={formRef} layout="vertical" style={{ width: '280px' }}>
                    <Item
                        rules={[{ required: true, message: '请输入用户' }]}
                        name="userName"
                        label="用户">
                        <Input style={{ borderColor: '#8b8b8b' }} />
                    </Item>
                    <Item
                        rules={[{ required: true, message: '请输入密码' }]}
                        name="password"
                        label="密码">
                        <Password style={{ borderColor: '#8b8b8b' }} />
                    </Item>
                    <Item>
                        <Row justify="end">
                            <Col>
                                <Button onClick={loginSubmit} type="primary">
                                    <KeyOutlined />
                                    <span>登录</span>
                                </Button>
                            </Col>
                        </Row>
                    </Item>
                </Form>
            </div>
        </div>
    </LoginBox>
};

export { Login };