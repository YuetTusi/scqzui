import debounce from 'lodash/debounce';
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'dva';
import SyncOutlined from '@ant-design/icons/SyncOutlined';
import KeyOutlined from '@ant-design/icons/KeyOutlined';
import UnlockOutlined from '@ant-design/icons/UnlockOutlined';
import Button from 'antd/lib/button';
import Empty from 'antd/lib/empty';
import Modal from 'antd/lib/modal';
import Select from 'antd/lib/select';
import Form from 'antd/lib/form';
import { StateTree } from '@/type/model';
import { AndroidSetModalState } from '@/model/default/android-set-modal';
import { helper } from '@/utils/helper';
import { AndroidSetModalBox } from './styled/style';
import { AndroidSetModalProp, FormValue, SetType } from './prop';

const { Item, useForm } = Form;
const { Option } = Select;

/**
 * 安卓设备操作框
 */
const AndroidSetModal: FC<AndroidSetModalProp> = ({
    visible,
    type,
    onCancel
}) => {

    const dispatch = useDispatch();
    const [formRef] = useForm<FormValue>();
    const { dev, message } = useSelector<StateTree, AndroidSetModalState>(state =>
        state.androidSetModal
    );

    const queryDev = debounce(
        () => {
            dispatch({ type: 'androidSetModal/queryDev' });
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
            const values = await validateFields();
            switch (type) {
                case SetType.PickAuth:
                    dispatch({
                        type: 'androidSetModal/pick',
                        payload: { id: values.id }
                    });
                    break;
                case SetType.Unlock:
                    dispatch({
                        type: 'androidSetModal/unlock',
                        payload: { id: values.id }
                    });
                    break;
            }
        } catch (error) {
            console.log(error);
        }
    };

    /**
    * 关闭弹框
    */
    const closeHandle = () => {
        dispatch({ type: 'androidSetModal/setDev', payload: [] });
        dispatch({ type: 'androidSetModal/closeAndroidAuth' });
        dispatch({ type: 'androidSetModal/clearMessage' });
        onCancel();
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
     * 渲染功能按钮
     * @returns 
     */
    const renderButton = () => {
        switch (type) {
            case SetType.PickAuth:
                return <Button
                    onClick={() => {
                        formSubmit();
                    }}
                    type="primary"
                    key="AAM_Pick">
                    <KeyOutlined />
                    <span>提权</span>
                </Button>;
            case SetType.Unlock:
                return <Button
                    onClick={() => {
                        formSubmit();
                    }}
                    type="primary"
                    key="AAM_Unlock">
                    <UnlockOutlined />
                    <span>解锁</span>
                </Button>;
        }
    };

    return <Modal
        footer={
            <>
                <Button
                    onClick={() => {
                        dispatch({ type: 'androidSetModal/clearMessage' });
                        queryDev();
                    }}
                    type="default"
                    key="AAM_0">
                    <SyncOutlined />
                    <span>刷新</span>
                </Button>
                {renderButton()}
            </>
        }
        onCancel={closeHandle}
        visible={visible}
        width={650}
        centered={true}
        destroyOnClose={true}
        maskClosable={false}
        getContainer="#root"
        title={type === SetType.PickAuth ? '安卓提权' : '安卓解锁'}>
        <AndroidSetModalBox>
            <div className="auth-cbox">
                <fieldset className="tip-msg full">
                    <legend>
                        操作提示
                    </legend>
                    <ul>
                        <li>操作提示</li>
                    </ul>
                </fieldset>
            </div>
            <Form form={formRef} layout="horizontal" style={{ marginTop: '24px' }}>
                <Item
                    rules={[
                        { required: true, message: '请选择提权设备' }
                    ]}
                    name="id"
                    label="设备"
                    labelCol={{ span: 2 }}
                    wrapperCol={{ span: 22 }}>
                    {
                        <Select
                            placeholder="请选择提权设备"
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
            </Form>
            <div className="set-msg">
                <div className="caption">消息</div>
                <div className="scroll-dev">{renderMessage()}</div>
            </div>
        </AndroidSetModalBox>
    </Modal>;
};

AndroidSetModal.defaultProps = {
    visible: false,
    type: SetType.PickAuth,
    onCancel: () => { }
};

export default AndroidSetModal;
