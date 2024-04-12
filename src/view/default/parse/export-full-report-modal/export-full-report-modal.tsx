import debounce from 'lodash/debounce';
import { OpenDialogReturnValue, ipcRenderer } from 'electron';
import React, { FC, useEffect, useState } from 'react';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import FileWordOutlined from '@ant-design/icons/FileWordOutlined';
import FileExcelOutlined from '@ant-design/icons/FileExcelOutlined';
import FilePdfOutlined from '@ant-design/icons/FilePdfOutlined';
import DashOutlined from '@ant-design/icons/DashOutlined';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Form from 'antd/lib/form';
import Radio from 'antd/lib/radio';
import Modal from 'antd/lib/modal';
import { FileSpan } from './styled/box';
import { ExportFullReportModalProp, ExportType, FormValue } from './prop';

const { Group } = Radio;
const { Item, useForm } = Form;

const ExportFullReportModal: FC<ExportFullReportModalProp> = ({
    visible, onCancel, onOk
}) => {

    const [formRef] = useForm<FormValue>();
    const [defaultPath, setDefaultPath] = useState<string>();

    useEffect(() => {
        const { setFieldsValue } = formRef;
        if (visible) {
            (async () => {
                const doc = await ipcRenderer.invoke('get-path', 'documents');
                setDefaultPath(doc);
                setFieldsValue({ saveAt: doc });
            })();
        }
    }, [visible]);

    /**
     * 案件/检材选择
     * @param {boolean} isCase 是否是案件
     */
    const onSelectSaveAt = debounce(
        async () => {
            const { setFieldsValue } = formRef;

            const { filePaths }: OpenDialogReturnValue = await ipcRenderer.invoke('open-dialog', {
                title: '请选择存储目录',
                defaultPath,
                properties: ['openDirectory'],
            });

            if (filePaths.length > 0) {
                setFieldsValue({ saveAt: filePaths[0] });
            }
        },
        400,
        { leading: true, trailing: false }
    );

    /**
     * 提交
     */
    const onSubmit = async () => {
        const { validateFields } = formRef;
        try {
            const values = await validateFields();
            onOk(values);
        } catch (error) {
            console.clear();
            console.warn(error);
        }
    };

    /**
     * 取消Click
     */
    const onCancelClick = () => {
        formRef.resetFields();
        onCancel();
    };

    return <Modal
        footer={[
            <Button
                onClick={() => onCancelClick()}
                type="default"
                key="EFRM_0">
                <CloseCircleOutlined />
                <span>取消</span></Button>,
            <Button
                onClick={() => onSubmit()}
                type="primary"
                key="EFRM_1">
                <CheckCircleOutlined />
                <span>确定</span>
            </Button>
        ]}
        visible={visible}
        onCancel={onCancelClick}
        title="导出全量报告"
        centered={true}
        destroyOnClose={true}
        maskClosable={false}
        forceRender={true}
        getContainer="#root">
        <Form
            form={formRef}
            layout="vertical">
            <Item
                label="导出格式"
                name="suffix"
                initialValue={ExportType.Word}>
                <Group>
                    <Radio value={ExportType.Word}>
                        <FileWordOutlined />
                        <FileSpan>Word</FileSpan>
                    </Radio>
                    <Radio value={ExportType.Excel}>
                        <FileExcelOutlined />
                        <FileSpan>Excel</FileSpan>
                    </Radio>
                    <Radio value={ExportType.PDF}>
                        <FilePdfOutlined />
                        <FileSpan>PDF</FileSpan>
                    </Radio>
                </Group>
            </Item>
            <Item
                rules={[
                    { required: true, message: '请选择存储目录' }
                ]}
                label="存储位置"
                name="saveAt">
                <Input
                    onClick={() => onSelectSaveAt()}
                    readOnly={true}
                    suffix={<DashOutlined />} />
            </Item>
        </Form>
    </Modal>;
};

export { ExportFullReportModal };