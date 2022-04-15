import debounce from 'lodash/debounce';
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import SyncOutlined from '@ant-design/icons/SyncOutlined';
import KeyOutlined from '@ant-design/icons/KeyOutlined';
import InteractionOutlined from '@ant-design/icons/InteractionOutlined';
import Button from 'antd/lib/button';
import Empty from 'antd/lib/empty';
import Modal from 'antd/lib/modal';
import Select from 'antd/lib/select';
import Form from 'antd/lib/form';
import { StateTree } from '@/type/model';
import { CrackModalState } from '@/model/default/crack-modal';
import { helper } from '@/utils/helper';
import { CrackModalProp, CrackTypes, FormValue, UserAction } from './prop';
import crackImg from './styled/images/crack_1.png';
import { CrackModalBox } from './styled/style';
import CrackTip from './crack-tip';

const { Item, useForm } = Form;
const { Option } = Select;

const CrackModal: FC<CrackModalProp> = ({
    visible,
    type,
    cancelHandle
}) => {

    const dispatch = useDispatch();
    const [formRef] = useForm<FormValue>();
    const { dev, message } = useSelector<StateTree, CrackModalState>(state =>
        state.crackModal
    );

    const getTitle = (type: CrackTypes) => {
        switch (type) {
            case CrackTypes.VivoAppLock:
                return 'VIVO应用锁破解';
            case CrackTypes.OppoAppLock:
                return 'OPPO应用锁破解';
            case CrackTypes.OppoMoveLock:
                return 'OPPO隐私锁破解';
            default:
                return '';
        }
    };

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
    const formSubmit = async (action: UserAction) => {
        const { validateFields } = formRef;

        try {
            const values = await validateFields();
            switch (action) {
                case UserAction.Crack:
                    dispatch({
                        type: 'crackModal/startCrack',
                        payload: { id: values.id, type }
                    });
                    break;
                case UserAction.Recover:
                    dispatch({
                        type: 'crackModal/startRecover',
                        payload: { id: values.id, type }
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
        dispatch({ type: 'crackModal/setDev', payload: [] });
        dispatch({ type: 'crackModal/closeCrack' });
        dispatch({ type: 'crackModal/clearMessage' });
        cancelHandle();
    };

    const renderOptions = () => {
        return dev.map(({ name, value }, index) => (
            <Option key={`Dev_${index}`} value={value}>
                {name}
            </Option>
        ));
    };

    const renderMessage = () => {
        if (helper.isNullOrUndefined(message) || message.length === 0) {
            return <Empty description="暂无消息" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
        } else {
            return (
                <ul>
                    {message.map((item, index) => (
                        <li key={`M_${index}`}>{item}</li>
                    ))}
                </ul>
            );
        }
    };

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
                <span>刷新设备</span>
            </Button>,
            <Button
                onClick={() => {
                    dispatch({ type: 'crackModal/clearMessage' });
                    formSubmit(UserAction.Crack);
                }}
                type="primary"
                key="CM_1">
                <KeyOutlined />
                <span>开始破解</span>
            </Button>,
            <Button
                onClick={() => {
                    dispatch({ type: 'crackModal/clearMessage' });
                    formSubmit(UserAction.Recover);
                }}
                type="primary"
                key="CM_2">
                <InteractionOutlined />
                <span>开始恢复</span>
            </Button>
        ]}
        visible={visible}
        width={850}
        centered={true}
        title={getTitle(type)}
        destroyOnClose={true}
        maskClosable={false}
        onCancel={closeHandle}>
        <CrackModalBox>
            <div className="crack-cbox">
                <div className="left">
                    <CrackTip type={type} />
                </div>
                <div className="right">
                    <fieldset className="tip-msg full">
                        <legend>
                            请勾选“<strong>一律允许</strong>”使用这台计算机进行调试
                        </legend>
                        <div>
                            <img src={crackImg} alt="破解提示" width="320" />
                        </div>
                    </fieldset>
                </div>
            </div>
            <Form form={formRef} layout="horizontal" style={{ marginTop: '10px' }}>
                <Item
                    rules={[
                        { required: true, message: '请选择破解设备' }
                    ]}
                    name="id"
                    label="设备"
                    labelCol={{ span: 2 }}
                    wrapperCol={{ span: 22 }}>
                    {
                        <Select
                            placeholder="请选择破解设备"
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
            <div className="crack-msg">
                <div className="caption">消息</div>
                <div className="scroll-dev">{renderMessage()}</div>
            </div>
        </CrackModalBox>
    </Modal>;
};

export default CrackModal;

function getFieldDecorator(arg0: string, arg1: { initialValue: any; rules: { required: boolean; message: string; }[]; }) {
    throw new Error('Function not implemented.');
}
