import { debounce } from 'lodash';
import { OpenDialogReturnValue, ipcRenderer } from 'electron';
import React, { FC, useEffect } from 'react';
import { useSelector } from 'dva';
import { Input, Form, Select } from 'antd';
import { StateTree } from '@/type/model';
import { PaperworkModalState } from '@/model/default/paperwork-modal';
import { helper } from '@/utils/helper';
import { StepProp } from './prop';

const { Item } = Form;
const { Option } = Select;

const StepOne: FC<StepProp> = ({ visible, formRef }) => {

    const {
        checkedDevices
    } = useSelector<StateTree, PaperworkModalState>((state) => state.paperworkModal);

    useEffect(() => {
        ipcRenderer
            .invoke('get-path', 'documents')
            .then(value => {
                formRef.setFieldsValue({ 'savePath': value });
            });
    }, []);

    useEffect(() => {
        if (checkedDevices.length === 0) {
            formRef.resetFields(['mobileHolder']);
        }
    }, [checkedDevices]);

    /**
     * 持有人Options
     */
    const bindOptions = () => {
        const options: JSX.Element[] = [];
        const holders = new Set<string>(checkedDevices.map(i => i.mobileHolder!));
        for (let item of holders.values()) {
            options.push(<Option value={item} key={`Holder_${item}`}>{item}</Option>);
        }
        return options;
    };

    /**
     * 选择目录
     */
    const selectDirHandle = debounce(() => {
        const { setFieldsValue } = formRef;
        ipcRenderer
            .invoke('open-dialog', {
                title: '请选择存储目录',
                properties: ['openDirectory'],
                defaultPath: helper.APP_CWD
            })
            .then(({ filePaths }: OpenDialogReturnValue) => {
                if (filePaths && filePaths.length > 0) {
                    setFieldsValue({ savePath: filePaths[0] });
                }
            }).catch(() => {
                setFieldsValue({ savePath: '' });
            });
    },
        600,
        { leading: true, trailing: false }
    );

    return <div style={{ display: visible ? 'block' : 'none' }}>
        <Form form={formRef} layout="vertical">
            <Item
                rules={[
                    { required: true, message: '请填写案件名称' }
                ]}
                name="caseName"
                label="案件名称">
                <Input />
            </Item>
            <Item name="caseNo" label="案件编号">
                <Input />
            </Item>
            <Item
                rules={[
                    { required: true, message: '请填写报告名称' }
                ]}
                name="reportName"
                label="报告名称">
                <Input />
            </Item>
            <Item
                name="reportNo"
                label="报告编号"
                initialValue="（网监）勘[  ]    号">
                <Input />
            </Item>
            <Item
                rules={[
                    { required: true, message: '请选择持有人' }
                ]}
                name="mobileHolder"
                label="持有人">
                <Select>
                    {bindOptions()}
                </Select>
            </Item>
            <Item
                rules={[
                    { required: true, message: '请选择保存路径' }
                ]}
                name="savePath"
                label="保存路径">
                <Input onClick={selectDirHandle} readOnly={true} addonAfter="..." />
            </Item>
        </Form>
    </div>;
};

export { StepOne };