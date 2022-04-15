import debounce from 'lodash/debounce';
import { ipcRenderer, OpenDialogReturnValue } from 'electron';
import React, { FC, MouseEvent, useEffect } from 'react';
import Input from 'antd/lib/input';
import Form from 'antd/lib/form';
import { useOsPath } from '@/hook/os-path';
import { SaveFormProp } from './prop';

const { Item } = Form;

const SaveForm: FC<SaveFormProp> = ({ formRef }) => {

    const documentPath = useOsPath('documents');

    useEffect(() => {
        formRef.setFieldsValue({ savePath: documentPath });
    }, [documentPath]);

    /**
     * 云帐单保存目录Handle
     */
    const onDirSelect = debounce(
        (event: MouseEvent<HTMLInputElement>) => {
            const { setFieldsValue } = formRef;
            ipcRenderer
                .invoke('open-dialog', {
                    properties: ['openDirectory']
                })
                .then((val: OpenDialogReturnValue) => {
                    if (val.filePaths && val.filePaths.length > 0) {
                        setFieldsValue({ savePath: val.filePaths[0] });
                    }
                });
        },
        500,
        { leading: true, trailing: false }
    );

    return <Form form={formRef} layout="vertical">
        <Item
            rules={[
                { required: true, message: '请选择帐单保存位置' }
            ]}
            name="savePath"
            label="帐单保存位置">
            <Input
                onClick={onDirSelect}
                readOnly={true}
                placeholder="帐单保存位置" />
        </Item>
    </Form>
}

export { SaveForm };