import electron, { OpenDialogReturnValue } from 'electron';
import debounce from 'lodash/debounce';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'dva';
import SyncOutlined from '@ant-design/icons/SyncOutlined';
import AndroidOutlined from '@ant-design/icons/AndroidOutlined';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Empty from 'antd/lib/empty';
import Modal from 'antd/lib/modal';
import Select from 'antd/lib/select';
import Table from 'antd/lib/table';
import Form from 'antd/lib/form';
import message from 'antd/lib/message';
import { StateTree } from '@/type/model';
import { ApkModalState } from '@/model/default/apk-modal';
import { helper } from '@/utils/helper';
import { ApkModalProp, FormValue } from './prop';
// import crackImg from './styled/images/crack_1.png';
import { ApkModalBox } from './styled/box';
import ApkTip from './apk-tip';
import { Key } from 'antd/lib/table/interface';

const { ipcRenderer } = electron;
const { Item, useForm } = Form;
const { Option } = Select;

const ApkModal: FC<ApkModalProp> = ({
    visible,
    cancelHandle
}) => {

    const dispatch = useDispatch();
    const [checkedKeys, setCheckedKeys] = useState<Key[]>([]);
    const [formRef] = useForm<FormValue>();
    const { phone, apk } = useSelector<StateTree, ApkModalState>(state =>
        state.apkModal
    );

    useEffect(() => {
        if (visible) {
            ipcRenderer
                .invoke('get-path', 'documents')
                .then((p) => formRef.setFieldValue('saveTo', p));
            dispatch({ type: 'apkModal/queryPhone' });
        }
    }, [visible]);

    /**
    * 表单Submit
    */
    const formSubmit = async () => {
        const { validateFields } = formRef;
        message.destroy();
        try {
            const values = await validateFields();
            if (checkedKeys.length === 0) {
                message.warn('请勾选提取应用');
            } else {
                dispatch({
                    type: 'apkModal/extract',
                    payload: {
                        phone: values.phone,
                        apk: checkedKeys,
                        saveTo: values.saveTo
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    /**
    * 关闭弹框
    */
    const closeHandle = () => {
        formRef.resetFields();
        dispatch({ type: 'apkModal/setApk', payload: [] });
        dispatch({ type: 'apkModal/setPhone', payload: [] });
        cancelHandle();
    };

    const renderOptions = () => {
        return phone.map(({ name, value }, index) => <Option key={`Dev_${index}`} value={value}>
            {name}
        </Option>);
    };

    /**
     * 设备Change
     * @param value  
     */
    const onPhoneChange = (value: string) => {
        dispatch({ type: 'apkModal/queryApk', payload: value });
    };

    /**
     * 选择目录
     */
    const selectDirHandle = debounce(
        () => {
            ipcRenderer
                .invoke('open-dialog', {
                    properties: ['openDirectory'],
                    defaultPath: helper.APP_CWD
                })
                .then((val: OpenDialogReturnValue) => {
                    if (val.filePaths && val.filePaths.length > 0) {
                        formRef.setFieldsValue({ saveTo: val.filePaths[0] });
                    }
                });
        },
        600,
        { leading: true, trailing: false }
    );

    return <Modal
        footer={[
            <Button
                onClick={() => {
                    formRef.resetFields(['phone']);
                    dispatch({ type: 'apkModal/setApk', payload: [] });
                    dispatch({ type: 'apkModal/setPhone', payload: [] });
                    dispatch({ type: 'apkModal/queryPhone' });
                }}
                type="default"
                key="APKM_1">
                <SyncOutlined />
                <span>刷新设备</span>
            </Button>,
            <Button
                onClick={() => {
                    formSubmit();
                }}
                type="primary"
                key="APKM_2">
                <AndroidOutlined />
                <span>提取apk</span>
            </Button>
        ]}
        visible={visible}
        width={800}
        centered={true}
        title="安卓apk提取"
        forceRender={true}
        destroyOnClose={true}
        maskClosable={false}
        onCancel={closeHandle}>
        <ApkModalBox>
            <div className="apk-cbox">
                <div className="left">
                    <ApkTip />
                </div>
            </div>
            <Form form={formRef} layout="horizontal" style={{ marginTop: '24px' }}>
                <Item
                    rules={[
                        { required: true, message: '请选择设备' }
                    ]}
                    name="phone"
                    label="设备"
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 21 }}>
                    {
                        <Select
                            onChange={onPhoneChange}
                            placeholder="请选择设备"
                            notFoundContent={
                                <Empty
                                    description="暂无设备"
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                />
                            }>
                            {renderOptions()}
                        </Select>
                    }
                </Item>
                <Item
                    rules={[
                        { required: true, message: '请选择存储位置' }
                    ]}
                    name="saveTo"
                    label="存储位置"
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 21 }}>
                    <Input
                        onClick={() => selectDirHandle()}
                        readOnly={true}
                        placeholder="请选择存储位置" />
                </Item>
            </Form>

            <Table
                columns={[
                    {
                        title: 'apk应用',
                        dataIndex: 'name',
                        key: 'name',
                    }
                ]}
                rowSelection={{
                    type: 'checkbox',
                    onChange: (keys) => {
                        setCheckedKeys(keys);
                    }
                }}
                dataSource={apk}
                pagination={false}
                bordered={true}
                scroll={{ y: 160 }}
                rowKey="value"
                size="small"
            />
        </ApkModalBox>
    </Modal>;
};

export default ApkModal;
