import throttle from 'lodash/throttle';
import React, { FC, MouseEvent } from 'react';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Modal from 'antd/lib/modal';
import { FormValue, ModifyPasswordModalProp } from './prop';
import { PasswordDigit } from '@/utils/regex';
import { helper } from '@/utils/helper';

const { Password } = Input;
const { useForm, Item } = Form;

/**
 * 密码修改框
 */
const ModifyPasswordModal: FC<ModifyPasswordModalProp> = ({
    visible,
    onCancel,
    onOk
}) => {

    const [formRef] = useForm<FormValue>();

    const onOkClick = (event: MouseEvent) => {
        event.preventDefault();
        onSubmit();
    };

    const onCancelClick = (event: MouseEvent) => {
        event.preventDefault();
        formRef.resetFields();
        onCancel();
    };

    const onSubmit = async () => {
        const { validateFields } = formRef;
        try {
            const { newPassword } = await validateFields();
            onOk(newPassword);
            formRef.resetFields();
        } catch (error) {
            console.warn(error);
        }
    };

    /**
     * 验证原口令一致
     */
    const validOldPassword = throttle(async (_: any, password: string) => {
        try {
            const old = await helper.oldPasswordEqual();
            if (old !== password && password !== undefined) {
                throw new Error('原口令不正确');
            }
        } catch (error) {
            throw error;
        }
    }, 200);

    /**
     * 验证新密码必须更换
     */
    const validChangePassword = throttle(async (_: any, password: string) => {
        try {
            const old = await helper.oldPasswordEqual();
            if (old === password) {
                throw new Error('请编写新口令');
            }
        } catch (error) {
            throw error;
        }
    }, 200);

    return <Modal
        footer={[
            <Button onClick={onCancelClick} type="default" key="MPM_1">
                <CloseCircleOutlined />
                <span>取消</span>
            </Button>,
            <Button
                onClick={onOkClick}
                type="primary" key="MPM_2">
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
        title="修改口令">
        <Form form={formRef} layout="vertical">
            <Item
                rules={[
                    { required: true, message: '请填写原口令' },
                    { validator: validOldPassword }
                ]}
                name="password"
                label="原口令">
                <Password placeholder="请输入原口令" />
            </Item>
            <Item
                rules={[
                    { required: true, message: '请填写新口令' },
                    { pattern: PasswordDigit, message: '口令长度8~20位' },
                    { validator: validChangePassword },
                    () => ({
                        validator(_, value) {
                            if (!value || helper.passwordStrength(value) >= 2) {
                                return Promise.resolve();
                            } else {
                                return Promise.reject(new Error('口令过于简单，请使用字母、数字或特殊符号组合'));
                            }
                        },
                    })
                ]}
                name="newPassword"
                label="新口令">
                <Password placeholder='8~20位，数字、字母或特殊符号组合' />
            </Item>
            <Item
                rules={[
                    { required: true, message: '请填写确认口令' },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('newPassword') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('确认口令与新口令不一致'));
                        },
                    })
                ]}
                name="confirmPassword"
                label="确认口令">
                <Password placeholder="重复输入新口令" />
            </Item>
        </Form>
    </Modal>
};

export { ModifyPasswordModal };