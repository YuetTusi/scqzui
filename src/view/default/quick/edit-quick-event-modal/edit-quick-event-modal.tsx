import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import { join } from 'path';
import { ipcRenderer, OpenDialogReturnValue } from 'electron';
import React, { FC, MouseEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'dva';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesDown } from '@fortawesome/free-solid-svg-icons';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Button from 'antd/lib/button';
import Input, { InputRef } from 'antd/lib/input';
import InputNumber from 'antd/lib/input-number';
import Switch from 'antd/lib/switch';
import Form, { RuleObject } from 'antd/lib/form';
import Modal from 'antd/lib/modal';
import { StateTree } from '@/type/model';
import { helper } from '@/utils/helper';
import { AllowCaseName } from '@/utils/regex';
import { QuickEvent } from '@/schema/quick-event';
import { EditQuickEventModalState } from '@/model/default/edit-quick-event-modal';
import AiSwitch from '@/component/ai-switch';
import { AiLabel, CategoryBox, ItemBox } from './styled/box';


const { caseText, fetchText } = helper.readConf()!;
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
    const [isCheck, setIsCheck] = useState(false);
    const [aiOpen, setAiOpen] = useState<boolean>(false);
    const eventNameRef = useRef<InputRef>(null);
    const [formRef] = useForm<QuickEvent>();
    let nameRules: RuleObject[] = [
        { required: true, message: `请填写${caseText ?? '案件'}名称` },
        { pattern: AllowCaseName, message: '不允许输入非法字符' }
    ];

    useEffect(() => {
        setTimeout(() => {
            if (eventNameRef.current) {
                eventNameRef.current.focus();
            }
        }, 0);
    }, [eventNameRef.current]);

    useEffect(() => {
        const { setFieldsValue } = formRef;
        if (data) {
            const [eventName] = data.eventName.split('_');
            setFieldsValue({ ...data, eventName });
            setAiOpen(data.isAi ?? false);
            dispatch({ type: 'aiSwitch/readAiConfig', payload: { casePath: join(data.eventPath, data.eventName) } });
        } else {
            dispatch({ type: 'aiSwitch/readAiConfig', payload: { casePath: undefined } });
        }
    }, [data]);

    useEffect(() => {
        if (!visible) {
            formRef.resetFields();
            dispatch({ type: 'editQuickEventModal/setData', payload: undefined });
        }
    }, [visible]);

    /**
     * 取消
     */
    const onCancel = () =>
        dispatch({ type: 'editQuickEventModal/setVisible', payload: false });

    /**
     * 保存
     */
    const onSave = debounce(async () => {
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
                    isAi: aiOpen,
                    eventName: `${values.eventName}_${timestamp}`
                };
            } else {
                //添加
                next = {
                    ...values,
                    isAi: aiOpen,
                    eventName: `${values.eventName}_${helper.timestamp()}`
                };
            }
            dispatch({ type: 'editQuickEventModal/saveOrUpdate', payload: next });
        } catch (error) {
            console.warn(error);
        }
    }, 500, { leading: true, trailing: false });

    /**
     * 验证案件重名
     */
    const validEventNameExist = throttle(async (_: any, value: string) => {
        setIsCheck(true);
        let next = value === '..' ? '.' : value;
        try {
            const { length } = await helper.eventNameExist(next);
            if (length > 0) {
                throw new Error(`${caseText ?? '案件'}名称已存在`);
            }
        } catch (error) {
            throw error;
        } finally {
            setIsCheck(false);
        }
    }, 500);

    if (helper.isNullOrUndefined(data?._id)) {
        nameRules = nameRules.concat([{
            validator: validEventNameExist,
            message: `${caseText ?? '案件'}名称已存在`
        }])
    }

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

    /**
     * 起始时段联动校验
     * @param rule 校验规则
     * @param value 值
     */
    const ruleToValid = async (_: RuleObject, value: any) => {
        const from = formRef.getFieldValue('ruleFrom');
        if (from === value) {
            throw new Error('不要等于起始时段');
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
        title={helper.isNullOrUndefined(data?._id) ? `添加${fetchText ?? '点验'}${caseText ?? '案件'}` : `编辑${fetchText ?? '点验'}${caseText ?? '案件'}`}
        width={860}
        centered={true}
        maskClosable={false}
        destroyOnClose={false}
        forceRender={true}
        className="zero-padding-body">
        <ItemBox padding="20px 20px 0 20px">
            <Form form={formRef} layout="horizontal" {...fromLayout}>
                <Item
                    rules={nameRules}
                    label={`${caseText ?? '案件'}名称`}
                    name="eventName"
                    hasFeedback={true}
                    validateStatus={isCheck ? 'validating' : undefined}
                    tooltip={helper.isNullOrUndefined(data?._id) ? undefined : `不可修改${caseText ?? '案件'}名称`}>
                    <Input ref={eventNameRef} disabled={!helper.isNullOrUndefined(data?._id)} />
                </Item>
                <Item
                    rules={[
                        { required: true, message: '请选择存储位置' }
                    ]}
                    label="存储位置"
                    name="eventPath"
                    tooltip={helper.isNullOrUndefined(data?._id) ? undefined : "不可修改存储位置"}>
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
                <Row style={{ marginBottom: '14px' }}>
                    <Col offset={3} span={2}>
                        <AiLabel>AI分析：</AiLabel>
                    </Col>
                    <Col span={2}>
                        <Switch
                            checked={aiOpen}
                            onChange={(checked) => setAiOpen(checked)}
                            size="small" />
                    </Col>
                </Row>
            </Form>
        </ItemBox>
        <div style={{ display: aiOpen ? 'block' : 'none' }}>
            <CategoryBox>
                <FontAwesomeIcon icon={faAnglesDown} />
                <span>AI信息</span>
            </CategoryBox>
            <ItemBox padding='0 40px 20px 40px'>
                <Row>
                    <Col span={24}>
                        <AiSwitch
                            casePath={data?.eventPath}
                            columnCount={5} />
                    </Col>
                </Row>
            </ItemBox>
        </div>
    </Modal>
};

export default EditQuickEventModal;