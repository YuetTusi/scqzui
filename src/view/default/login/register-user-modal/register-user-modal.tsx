import React, { FC, MouseEvent } from 'react';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Modal from 'antd/lib/modal';
import { FormValue, RegisterUserModalProp } from './prop';
import { helper } from '@/utils/helper';
import { PasswordDigit } from '@/utils/regex';

const { Password } = Input;
const { useForm, Item } = Form;

/**
 * 新用户注册窗口
 */
const RegisterUserModal: FC<RegisterUserModalProp> = ({
    visible,
    onCancel,
    onOk
}) => {

    const [formRef] = useForm<FormValue>();

    const onOkClick = (event: MouseEvent) => {
        event.preventDefault();
        onSumbitClick();
    };

    const onCancelClick = (event: MouseEvent) => {
        event.preventDefault();
        formRef.resetFields();
        onCancel();
    };

    const onSumbitClick = async () => {
        const { validateFields } = formRef;
        try {
            const { userName, password } = await validateFields();
            onOk(userName, password);
        } catch (event) {
            console.warn(event);
        }
    }

    return <Modal
        footer={[
            <Button onClick={onCancelClick} type="default" key="RUM_1">
                <CloseCircleOutlined />
                <span>取消</span>
            </Button>,
            <Button
                onClick={onOkClick}
                type="primary" key="RUM_2">
                <CheckCircleOutlined />
                <span>确定</span>
            </Button>
        ]}
        onCancel={onCancelClick}
        visible={visible}
        centered={true}
        maskClosable={false}
        destroyOnClose={true}
        width={400}
        getContainer="#root"
        title="新用户">
        <Form
            form={formRef}
            layout="vertical">
            <Item
                rules={[
                    { required: true, message: '请填写用户' }
                ]}
                name="userName"
                label="用户">
                <Input />
            </Item>
            <Item
                rules={[
                    { required: true, message: '请填写口令' },
                    { pattern: PasswordDigit, message: '8~20位，数字、字母或特殊符号组合' },
                    () => ({
                        validator(_, value) {
                            if (!value || helper.passwordStrength(value) >= 2) {
                                return Promise.resolve();
                            } else {
                                return Promise.reject(new Error('口令过于简单，请使用字母、数字，特殊符号组合'));
                            }
                        },
                    })
                ]}
                name="password"
                label="口令">
                <Password placeholder="8~20位，数字、字母或特殊符号组合" />
            </Item>
            <Item
                rules={[
                    { required: true, message: '请填写确认口令' },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('确认口令与原口令不一致'));
                        },
                    })
                ]}
                name="confirmPassword"
                label="确认口令">
                <Password placeholder="重复输入口令" />
            </Item>
        </Form>
    </Modal>
};

export { RegisterUserModal };