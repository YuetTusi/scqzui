import { ipcRenderer, OpenDialogReturnValue } from 'electron';
import React, { FC, MouseEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import InputNumber from 'antd/lib/input-number';
import Form, { RuleObject } from 'antd/lib/form';
import Modal from 'antd/lib/modal';
import { QuickEvent } from '@/schema/quick-event';
import { useOsPath } from '@/hook/os-path';
import { StateTree } from '@/type/model';
import { EditQuickEventModalState } from '@/model/default/edit-quick-event-modal';
import { helper } from '@/utils/helper';

const { Item, useForm } = Form;
const fromLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 18 },
};

/**
 * 添加/编辑快速点验案件框
 */
const EditQuickEventModal: FC<EditModalProp> = () => {

    const dispatch = useDispatch();
    const {
        visible,
        data
    } = useSelector<StateTree, EditQuickEventModalState>(state => state.editQuickEventModal);
    const [formRef] = useForm<QuickEvent>();
    const docPath = useOsPath('documents');

    useEffect(() => {
        const { setFieldsValue } = formRef;
        if (data) {
            const [eventName] = data.eventName.split('_');
            setFieldsValue({ ...data, eventName });
        }
    }, [data]);

    useEffect(() => {
        formRef.setFieldsValue({ eventPath: docPath });
    }, [docPath]);

    useEffect(() => {
        if (!visible) {
            formRef.resetFields();
            dispatch({ type: 'editQuickEventModal/setData', payload: undefined });
        }
    }, [visible])

    /**
     * 取消
     */
    const onCancel = () => {
        dispatch({ type: 'editQuickEventModal/setVisible', payload: false });
    };

    /**
     * 保存
     */
    const onSave = async () => {
        const { validateFields } = formRef;
        try {
            const values = await validateFields();
            let next = values;
            if (data?._id) {
                //编辑
                const [, timestamp] = data.eventName.split('_');
                next = {
                    ...values,
                    _id: data._id,
                    eventName: `${values.eventName}_${timestamp}`
                };
            } else {
                //添加
                next = {
                    ...values,
                    eventName: `${values.eventName}_${helper.timestamp()}`
                };
            }
            dispatch({ type: 'editQuickEventModal/saveOrUpdate', payload: next });
        } catch (error) {
            console.warn(error);
        }
    };

    /**
     * 选择目录
     */
    const onDirSelect = async (event: MouseEvent<HTMLInputElement>) => {
        event.preventDefault();
        const { setFieldsValue } = formRef;
        try {
            const { filePaths }: OpenDialogReturnValue = await ipcRenderer.invoke('open-dialog', {
                properties: ['openDirectory', 'createDirectory']
            });
            if (filePaths.length > 0) {
                setFieldsValue({ eventPath: filePaths[0] });
            }
        } catch (error) {
            console.warn(error);
        }
    };

    const ruleToValid = async (rule: RuleObject, value: any) => {
        console.log(rule);
        console.log(value);
        const from = formRef.getFieldValue('ruleFrom');
        if (from >= value) {
            throw new Error('请大于起始时段');
        }
    };

    return <Modal
        footer={[
            <Button
                onClick={() => onCancel()}
                type="default"
                key="EEM_0">
                <CloseCircleOutlined />
                <span>取消</span>
            </Button>,
            <Button
                onClick={() => onSave()}
                type="primary"
                key="EEM_1">
                <CheckCircleOutlined />
                <span>确定</span>
            </Button>
        ]}
        onCancel={onCancel}
        visible={visible}
        title="编辑点验案件"
        width={600}
        centered={true}
        maskClosable={false}
        destroyOnClose={false}
        forceRender={true}
    >
        <Form form={formRef} layout="horizontal" {...fromLayout}>
            <Item
                rules={[
                    { required: true, message: '请填写案件名称' }
                ]}
                label="案件名称"
                name="eventName">
                <Input />
            </Item>
            <Item
                rules={[
                    { required: true, message: '请选择存储位置' }
                ]}
                initialValue={docPath}
                label="存储位置"
                name="eventPath">
                <Input
                    onClick={onDirSelect}
                    disabled={!helper.isNullOrUndefined(data?._id)}
                    readOnly={true}
                    placeholder="请选择存储位置" />
            </Item>
            <Row>
                <Col span={12}>
                    <Item
                        rules={[
                            { required: true, message: '请填写违规时段' }
                        ]}
                        label="违规时段 起"
                        name="ruleFrom"
                        initialValue={0}
                        labelCol={{ span: 10 }}
                        wrapperCol={{ span: 12 }}>
                        <InputNumber min={0} max={24} style={{ width: '100%' }} />
                    </Item>
                </Col>
                <Col span={12}>
                    <Item
                        rules={[
                            { required: true, message: '请填写违规时段' },
                            { validator: ruleToValid }
                        ]}
                        label="违规时段 止"
                        name="ruleTo"
                        initialValue={8}
                        labelCol={{ span: 10 }}
                        wrapperCol={{ span: 12 }}>
                        <InputNumber min={0} max={24} style={{ width: '100%' }} />
                    </Item>
                </Col>
            </Row>
        </Form>
    </Modal>
};

export default EditQuickEventModal;