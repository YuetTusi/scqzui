// import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/zh_CN';
import React, { FC, MouseEvent, useEffect, useState } from 'react';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import PlusCircleOutlined from '@ant-design/icons/PlusCircleOutlined';
import { Col, Row, Button, Card, Form, Input, DatePicker } from 'antd';
import { StandardModal } from '../../standard-modal';
import { StepProp } from './prop';

const Datepicker = DatePicker as any;
const { Item } = Form;
const { TextArea } = Input;

/**
 * 第2步
 */
const StepTwo: FC<StepProp> = ({ visible, formRef }) => {

    const [standardModalOpen, setStandardModalOpen] = useState(false);
    const [standard, setStandard] = useState<string[]>([]);

    useEffect(() => {
        formRef.setFieldsValue({
            checkFrom: dayjs().add(-1, 'day'),
            checkTo: dayjs()
        });
    }, []);

    const onStandardSelect = (values: string[]) => {
        setStandard(values);
        setStandardModalOpen(false);
    };

    const onDrop = (value: string) => {
        setStandard(prev => prev.filter(i => i !== value));
    };

    const renderStandard = () => {
        return standard.map((item, index) => <p
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

    return <div
        style={{ display: visible ? 'block' : 'none' }}>
        <Form layout="vertical" form={formRef}>
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
                name="standard"
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
            defaultValue={standard}
            onCancel={() => setStandardModalOpen(false)} />
    </div>;
};

export { StepTwo };