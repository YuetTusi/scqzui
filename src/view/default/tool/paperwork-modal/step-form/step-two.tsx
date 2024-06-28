// import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/zh_CN';
import React, { FC, MouseEvent, useEffect, useState } from 'react';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import PlusCircleOutlined from '@ant-design/icons/PlusCircleOutlined';
import { Col, Row, Button, Card, Form, Input, DatePicker } from 'antd';
import { StandardModal } from '../../standard-modal';
import { FormTwoBox } from './styled/box';
import { StepProp } from './prop';
import { useDispatch, useSelector } from 'dva';
import { StateTree } from '@/type/model';
import { PaperworkModalState } from '@/model/default/paperwork-modal';
import { throttle } from 'lodash';

const Datepicker = DatePicker as any;
const { Item } = Form;
const { TextArea } = Input;

/**
 * 第2步
 */
const StepTwo: FC<StepProp> = ({ visible, formRef }) => {

    const dispatch = useDispatch();
    const [standardModalOpen, setStandardModalOpen] = useState(false);
    const {
        twoFormValue
    } = useSelector<StateTree, PaperworkModalState>(state => state.paperworkModal);

    useEffect(() => {
        formRef.setFieldsValue({
            checkFrom: dayjs().add(-1, 'day'),
            checkTo: dayjs()
        });
        dispatch({
            type: 'paperworkModal/setTwoFormValue', payload: {
                delegation: '',
                checkFrom: dayjs().add(-1, 'day').format('YYYY-MM-DD HH:mm:ss'),
                checkTo: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                checker: '',
                condition: '',
                purpose: '',
                standard: [],
                equipment: '',
            }
        });
    }, []);

    const onStandardSelect = (values: string[]) => {
        dispatch({
            type: 'paperworkModal/setTwoFormValue', payload: {
                ...twoFormValue,
                standard: values
            }
        });
        setStandardModalOpen(false);
    };

    const onDrop = (value: string) => {
        const next = twoFormValue.standard.filter(i => i !== value);
        dispatch({
            type: 'paperworkModal/setTwoFormValue', payload: {
                ...twoFormValue,
                standard: next
            }
        });
    };

    const renderStandard = () => {
        return (twoFormValue?.standard ?? []).map((item, index) => <p
            key={`SS_${index}`}>
            <Button
                onClick={() => onDrop(item)}
                size="small"
                type="primary"
                danger={true}
                title="删除">
                <DeleteOutlined />
            </Button>
            <span style={{ marginLeft: '10px' }}>{item}</span>
        </p>);
    };

    /**
     * 表单项Change后更新对应值到store中
     */
    const onFormValueChange = throttle((changedValues: Record<string, any>) => {
        const next = { ...twoFormValue, ...changedValues };
        dispatch({
            type: 'paperworkModal/setTwoFormValue', payload: next
        });
    }, 200, { leading: false, trailing: true });

    return <FormTwoBox
        style={{ display: visible ? 'block' : 'none' }}>
        <Form
            onValuesChange={onFormValueChange}
            layout="vertical"
            form={formRef}>
            <Item
                name="delegation"
                label="委托信息">
                <Input />
            </Item>
            <Row>
                <Col flex="auto">
                    <Item
                        name="checkFrom"
                        label="检查时间 起">
                        <Datepicker showTime={true} locale={locale} />
                    </Item>
                </Col>
                <Col flex="auto">
                    <Item
                        name="checkTo"
                        label="检查时间 止">
                        <Datepicker showTime={true} locale={locale} />
                    </Item>
                </Col>
                <Col flex={1}>
                    <Item
                        name="checker"
                        label="检查人">
                        <Input />
                    </Item>
                </Col>
            </Row>
            <Item
                name="condition"
                label="检查对象封存固定情况">
                <Input />
            </Item>
            <Item
                name="purpose"
                label="检查目的">
                <TextArea />
            </Item>
            <Item
                label={
                    <>
                        <span>检查依据方法</span>
                        <Button
                            onClick={() => setStandardModalOpen(true)}
                            type="primary"
                            size="small"
                            style={{ marginLeft: '10px' }}>
                            <PlusCircleOutlined />
                            添加
                        </Button>
                    </>
                }>
                <Card
                    size="small"
                    className="standard-card">
                    {renderStandard()}
                </Card>
            </Item>
            <Item
                name="equipment"
                label="检查设备">
                <TextArea />
            </Item>
        </Form>
        <StandardModal
            open={standardModalOpen}
            onOk={onStandardSelect}
            defaultValue={twoFormValue.standard}
            onCancel={() => setStandardModalOpen(false)} />
    </FormTwoBox>;
};

export { StepTwo };