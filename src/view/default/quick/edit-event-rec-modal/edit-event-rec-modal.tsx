import React, { FC, MouseEvent, useEffect } from 'react';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Form from 'antd/lib/form';
import Modal from 'antd/lib/modal';
import { QuickRecord } from '@/schema/quick-record';
import { EditEventRecModalProp, FormValue } from './prop';


const { Item, useForm } = Form;
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 }
};

/**
 * 编辑框
 */
const EditEventRecModal: FC<EditEventRecModalProp> = ({
    visible,
    data,
    onSaveHandle,
    onCancelHandle
}) => {

    const [formRef] = useForm<FormValue>();

    useEffect(() => {
        if (visible) {
            formRef.setFieldsValue({
                mobileHolder: data?.mobileHolder,
                mobileNo: data?.mobileNo,
                note: data?.note
            });
        }
    }, [visible]);

    /**
     * 保存Click
     */
    const onSaveClick = async (event: MouseEvent) => {
        event.preventDefault();
        const { validateFields } = formRef;
        try {
            const values = await validateFields();
            const next: QuickRecord = {
                ...data,
                mobileHolder: values.mobileHolder,
                mobileNo: values.mobileNo,
                note: values.note
            }
            onSaveHandle(next);
        } catch (error) {
            console.clear();
            console.warn(error);
        }
    };

    return <Modal
        footer={[
            <Button
                onClick={() => onCancelHandle()}
                type="default"
                key="EERM_0">
                <CloseCircleOutlined />
                <span>取消</span>
            </Button>,
            <Button
                onClick={onSaveClick}
                type="primary"
                key="EERM_1">
                <CheckCircleOutlined />
                <span>确定</span>
            </Button>
        ]}
        onCancel={() => onCancelHandle()}
        visible={visible}
        centered={true}
        maskClosable={false}
        destroyOnClose={true}
        title={`编辑设备 ${data?.mobileName === undefined ? '' : data.mobileName.split('_')[0]}`}>
        <Form form={formRef} {...formItemLayout}>
            <Item
                rules={[
                    { required: true, message: '请填写持有人' }
                ]}
                name="mobileHolder"
                label="持有人">
                <Input maxLength={20} />
            </Item>
            <Item name="mobileNo" label="手机编号">
                <Input maxLength={10} />
            </Item>
            <Item name="note" label="备注">
                <Input maxLength={100} />
            </Item>
        </Form>
    </Modal>;
};

EditEventRecModal.defaultProps = {
    visible: false
}

export default EditEventRecModal;