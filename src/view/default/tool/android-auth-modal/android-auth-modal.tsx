import debounce from 'lodash/debounce';
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'dva';
import SyncOutlined from '@ant-design/icons/SyncOutlined';
import KeyOutlined from '@ant-design/icons/KeyOutlined';
import Button from 'antd/lib/button';
import Empty from 'antd/lib/empty';
import Modal from 'antd/lib/modal';
import Select from 'antd/lib/select';
import Form from 'antd/lib/form';
import { StateTree } from '@/type/model';
import { AndroidAuthModalState } from '@/model/default/android-auth-modal';
import { helper } from '@/utils/helper';
import { AndroidAuthModalProp, FormValue } from './prop';
import { AndroidAuthModalBox } from './styled/style';
// import CrackTip from './crack-tip';

const { Item, useForm } = Form;
const { Option } = Select;

/**
 * 安卓提权框
 */
const AndroidAuthModal: FC<AndroidAuthModalProp> = ({
    visible,
    onCancel
}) => {

    const dispatch = useDispatch();
    const [formRef] = useForm<FormValue>();
    const { dev, message } = useSelector<StateTree, AndroidAuthModalState>(state =>
        state.androidAuthModal
    );

    const queryDev = debounce(
        () => {
            dispatch({ type: 'androidAuthModal/queryDev' });
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
            dispatch({
                type: 'androidAuthModal/pick',
                payload: { id: values.id }
            });
        } catch (error) {
            console.log(error);
        }
    };

    /**
    * 关闭弹框
    */
    const closeHandle = () => {
        dispatch({ type: 'androidAuthModal/setDev', payload: [] });
        dispatch({ type: 'androidAuthModal/closeAndroidAuth' });
        dispatch({ type: 'androidAuthModal/clearMessage' });
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

    return <Modal
        footer={[
            <Button
                onClick={() => {
                    dispatch({ type: 'androidAuthModal/clearMessage' });
                    queryDev();
                }}
                type="default"
                key="AAM_0">
                <SyncOutlined />
                <span>刷新</span>
            </Button>,
            <Button
                onClick={() => {
                    dispatch({ type: 'androidAuthModal/clearMessage' });
                    formSubmit();
                }}
                type="primary"
                key="AAM_1">
                <KeyOutlined />
                <span>提权</span>
            </Button>
        ]}
        onCancel={closeHandle}
        visible={visible}
        width={650}
        centered={true}
        destroyOnClose={true}
        maskClosable={false}
        getContainer="#root"
        title="安卓提权">
        <AndroidAuthModalBox>
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
            <div className="auth-msg">
                <div className="caption">消息</div>
                <div className="scroll-dev">{renderMessage()}</div>
            </div>
        </AndroidAuthModalBox>
    </Modal>;
};

export default AndroidAuthModal;
