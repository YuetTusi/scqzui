import React, { FC, MouseEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'dva';
import KeyOutlined from '@ant-design/icons/KeyOutlined';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Form from 'antd/lib/form';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import { StateTree } from '@/type/model';
import { LoginBox } from './styled/box';
import { RegisterUserModal } from './register-user-modal';
import { ModifyPasswordModal } from './modify-password-modal';
import { FormValue, LoginProp } from './prop';
import { useKeyboardEvent } from '@/hook';

const { Item, useForm } = Form;
const { Password } = Input;

/**
 * 用户登录
 */
const Login: FC<LoginProp> = () => {
    const dispatch = useDispatch();
    const [formRef] = useForm<FormValue>();
    const [modifyPasswordModalVisible, setModifyPasswordModalVisible] = useState<boolean>(false);
    const {
        registerUserModalVisible,
        loading
    } = useSelector((state: StateTree) => state.login);

    useEffect(() => {
        dispatch({ type: 'login/init' });
    }, []);

    const loginSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
        const { validateFields } = formRef;
        e.preventDefault();

        try {
            const { userName, password } = await validateFields();
            dispatch({
                type: 'login/queryByNameAndPassword',
                payload: { userName, password }
            });
        } catch (error) {
            console.warn(error);
        }
    };

    /**
     * 登录按钮键盘事件
     */
    const onLoginKeydown = async ({ code }: KeyboardEvent) => {
        const { validateFields } = formRef;
        if (code === 'Enter' || code === 'NumpadEnter') {
            try {
                const { userName, password } = await validateFields();
                dispatch({
                    type: 'login/queryByNameAndPassword',
                    payload: { userName, password }
                });
            } catch (error) {
                console.warn(error);
            }
        }
    };

    useKeyboardEvent('keydown', onLoginKeydown);

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
                        rules={[{ required: true, message: '请输入口令' }]}
                        name="password"
                        label="口令">
                        <Password visibilityToggle={false} style={{ borderColor: '#8b8b8b' }} />
                    </Item>
                    <Item>
                        <Row justify="space-between">
                            <Col>
                                <Button
                                    onClick={() => setModifyPasswordModalVisible(true)}
                                    type="link"
                                    style={{ fontSize: '12px', padding: '0' }}>
                                    修改口令
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    onClick={loginSubmit}
                                    disabled={loading}
                                    type="primary">
                                    {loading ? <LoadingOutlined /> : <KeyOutlined />}
                                    <span>登录</span>
                                </Button>
                            </Col>
                        </Row>
                    </Item>
                </Form>
            </div>
        </div>
        <RegisterUserModal
            visible={registerUserModalVisible}
            onCancel={() => dispatch({ type: 'login/setRegisterUserModalVisible', payload: false })}
            onOk={(userName, password) => {
                dispatch({
                    type: 'login/saveOrUpdateUser', payload: { userName, password }
                });
            }} />
        <ModifyPasswordModal
            visible={modifyPasswordModalVisible}
            onCancel={() => setModifyPasswordModalVisible(false)}
            onOk={(newPassword) => {
                dispatch({
                    type: 'login/updatePassword', payload: newPassword
                });
                setModifyPasswordModalVisible(false)
            }}
        />
    </LoginBox>
};

export { Login };