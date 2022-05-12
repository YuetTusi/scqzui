import React, { FC, MouseEvent, useEffect } from 'react';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Form from 'antd/lib/form';
import Modal from 'antd/lib/modal';
import { AllowCaseName } from '@/utils/regex';
import { SelfUnit } from '@/schema/self-unit';
import { EditUnitModalProp } from './prop';

const { Item, useForm } = Form;

/**
 * 编辑框
 */
const EditUnitModal: FC<EditUnitModalProp> = ({
    data,
    visible,
    saveHandle,
    cancelHandle
}) => {

    const [formRef] = useForm<SelfUnit>();

    useEffect(() => {
        if (data !== undefined) {
            formRef.setFieldsValue(data);
        } else {
            formRef.resetFields();
        }
    }, [data]);

    /**
     * 保存Click
     */
    const onSaveClick = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const { validateFields, resetFields } = formRef;
        try {
            const values = await validateFields();
            saveHandle({
                ...values,
                _id: data?._id
            });
        } catch (error) {
            console.warn(error);
        } finally {
            resetFields();
        }
    };

    return <Modal
        footer={[
            <Button onClick={() => cancelHandle()} type="default" key="EUM_0">
                <CloseCircleOutlined />
                <span>取消</span>
            </Button>,
            <Button onClick={onSaveClick} type="primary" key="EUM_1">
                <CheckCircleOutlined />
                <span>确定</span>
            </Button>
        ]}
        onCancel={cancelHandle}
        visible={visible}
        centered={true}
        forceRender={true}
        maskClosable={false}
        destroyOnClose={true}
        title={data === undefined ? '添加单位' : '编辑单位'}
    >
        <Form form={formRef} layout="horizontal">
            <Item
                rules={[
                    { required: true, message: '请填写单位名称' },
                    { pattern: AllowCaseName, message: '禁止输入非法字符' }
                ]}
                name="unitName"
                label="单位名称">
                <Input maxLength={50} />
            </Item>
        </Form>
    </Modal>
};

export default EditUnitModal;