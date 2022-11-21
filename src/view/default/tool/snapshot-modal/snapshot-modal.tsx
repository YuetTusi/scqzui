import debounce from 'lodash/debounce';
import { ipcRenderer, OpenDialogReturnValue } from 'electron';
import React, { FC, MouseEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'dva';
import SyncOutlined from '@ant-design/icons/SyncOutlined';
import CameraOutlined from '@ant-design/icons/CameraOutlined';
import Button from 'antd/lib/button';
import Empty from 'antd/lib/empty';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Modal from 'antd/lib/modal';
import Select from 'antd/lib/select';
import { StateTree } from '@/type/model';
import { helper } from '@/utils/helper';
import { CrackModalState } from '@/model/default/crack-modal';
import { CrackTypes } from '../crack-modal/prop';
import { SnapshotModalBox } from './styled/box';
import { FormValue, SnapshotModalProp } from './prop';

const { Item, useForm } = Form;
const { Option } = Select;

/**
 * 截屏窗口
 */
const SnapshotModal: FC<SnapshotModalProp> = ({
    visible,
    // type,
    cancelHandle
}) => {

    const dispatch = useDispatch();
    const [defPath, setDefPath] = useState('');
    const [formRef] = useForm<FormValue>();
    const { dev, message } = useSelector<StateTree, CrackModalState>(state =>
        state.crackModal
    );

    useEffect(() => {
        ipcRenderer
            .invoke('get-path', 'documents')
            .then(p => setDefPath(p));
    }, [visible]);

    const queryDev = debounce(
        () => {
            dispatch({ type: 'crackModal/queryDev' });
        },
        500,
        { leading: true, trailing: false }
    );

    /**
    * 表单Submit
    */
    const formSubmit = async () => {
        const { validateFields } = formRef;

        try {
            const { id, saveTo } = await validateFields();
            dispatch({
                type: 'crackModal/snapshot',
                payload: {
                    id,
                    saveTo,
                    type: CrackTypes.Snapshot
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    /**
    * 关闭弹框
    */
    const closeHandle = () => {
        dispatch({ type: 'crackModal/setDev', payload: [] });
        dispatch({ type: 'crackModal/closeCrack' });
        dispatch({ type: 'crackModal/clearMessage' });
        cancelHandle();
    };

    const renderOptions = () => {
        return dev.map(({ name, value }, index) => <Option key={`Dev_${index}`} value={value}>
            {name}
        </Option>);
    };

    const renderMessage = () => {
        if (helper.isNullOrUndefined(message) || message.length === 0) {
            return <Empty description="暂无消息" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
        } else {
            return <ul>
                {message.map((item, index) => <li key={`M_${index}`}>{item}</li>)}
            </ul>
        }
    };

    /**
     * 保存目录Handle
     */
    const selectSaveHandle = debounce(
        (event: MouseEvent<HTMLInputElement>) => {
            event.preventDefault();
            const { setFieldsValue } = formRef;
            ipcRenderer
                .invoke('open-dialog', {
                    properties: ['openDirectory']
                })
                .then((val: OpenDialogReturnValue) => {
                    if (val.filePaths && val.filePaths.length > 0) {
                        setFieldsValue({ saveTo: val.filePaths[0] });
                    }
                });
        },
        500,
        { leading: true, trailing: false }
    );

    return <Modal
        footer={[
            <Button
                onClick={() => {
                    dispatch({ type: 'crackModal/clearMessage' });
                    queryDev();
                }}
                type="default"
                key="CM_0">
                <SyncOutlined />
                <span>刷新</span>
            </Button>,
            <Button
                onClick={() => {
                    dispatch({ type: 'crackModal/clearMessage' });
                    formSubmit();
                }}
                type="primary"
                key="CM_1">
                <CameraOutlined />
                <span>截屏获取</span>
            </Button>
        ]}
        visible={visible}
        width={850}
        centered={true}
        title="截屏获取"
        destroyOnClose={true}
        maskClosable={false}
        onCancel={closeHandle}>
        <SnapshotModalBox>
            <fieldset className="tip-msg full">
                <legend>
                    操作提示
                </legend>
                <div>
                    <ul>
                        <li>
                            请将截屏设备插入USB接口
                        </li>
                        <li>
                            选择截屏设备及保存目录，若无设备请进行刷新，点击按钮截取
                        </li>
                    </ul>
                </div>
            </fieldset>
            <Form form={formRef} layout="horizontal" style={{ marginTop: '24px' }}>
                <Item
                    rules={[
                        { required: true, message: '请选择截屏设备' }
                    ]}
                    name="id"
                    label="截屏设备"
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 22 }}>
                    {
                        <Select
                            placeholder="请选择截屏设备"
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
                        { required: true, message: '请选保存目录' }
                    ]}
                    initialValue={defPath}
                    name="saveTo"
                    label="保存目录"
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 22 }}>
                    <Input
                        readOnly={true}
                        onClick={selectSaveHandle}
                    />
                </Item>
            </Form>
            <div className="cut-msg">
                <div className="caption">消息</div>
                <div className="scroll-dev">{renderMessage()}</div>
            </div>
        </SnapshotModalBox>
    </Modal>;
};

export { SnapshotModal };
