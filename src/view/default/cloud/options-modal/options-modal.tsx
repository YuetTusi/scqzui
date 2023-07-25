import dayjs from 'dayjs';
import React, { FC, useEffect, useState, MouseEvent } from 'react';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import CheckSquareOutlined from '@ant-design/icons/CheckSquareOutlined';
import Button from 'antd/lib/button';
import Checkbox from 'antd/lib/checkbox';
import DatePicker from 'antd/lib/date-picker';
import Divider from 'antd/lib/divider';
import Segmented, { SegmentedValue } from 'antd/lib/segmented';
import Form from 'antd/lib/form';
import Modal from 'antd/lib/modal';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import { FormValue, OptionsModalProp } from './prop';
import { FetchOption, TimeRange } from '@/schema/cloud-app';
import { FooterButtonBox } from './styled/box';

const { Item, useForm } = Form;
const Datepicker = DatePicker as any;
// const formItemLayout = {
//     labelCol: { span: 4 },
//     wrapperCol: { span: 6 }
// };

/**
 * 云取应用提取项配置框
 */
const OptionsModal: FC<OptionsModalProp> = ({
    visible, app, onCancel, onSave
}) => {

    const [formRef] = useForm<FormValue>();
    const [range, setRange] = useState<TimeRange>(TimeRange.OneMonthAgo);

    useEffect(() => {
        const { setFieldsValue } = formRef;
        if (visible) {
            if (app.option === undefined) {
                setRange(TimeRange.OneMonthAgo);
                setFieldsValue({
                    startTime: dayjs().add(-1, 'M'),
                    endTime: dayjs(),
                    item1: true,
                    item2: false,
                    item3: false,
                    item4: false,
                    item5: false,
                    item6: false,
                    item7: false,
                    item8: false,
                    item9: false,
                    item10: false,
                    item11: false,
                    item12: false
                });
            } else {
                setRange(app.option.timeRange);
                app.option.timeRange === TimeRange.All
                    ? setFieldsValue({
                        ...app.option,
                        startTime: undefined,
                        endTime: undefined
                    })
                    : setFieldsValue({
                        ...app.option,
                        startTime: dayjs(app.option.startTime),
                        endTime: dayjs(app.option.endTime)
                    });
            }
        }
    }, [visible, app]);

    const resetForm = () => {
        const { setFieldsValue } = formRef;
        setRange(TimeRange.OneMonthAgo);
        setFieldsValue({
            startTime: dayjs().add(-1, 'M'),
            endTime: dayjs(),
            item1: true,
            item2: false,
            item3: false,
            item4: false,
            item5: false,
            item6: false,
            item7: false,
            item8: false,
            item9: false,
            item10: false,
            item11: false,
            item12: false
        });
    };

    const onModalSave = (event: MouseEvent) => {
        event.preventDefault();
        const values = formRef.getFieldsValue();
        onSave(values);
        resetForm();
    };

    const onModalCancel = (event: MouseEvent) => {
        event.preventDefault();
        resetForm();
        onCancel();
    };

    const onCheckAll = (event: MouseEvent) => {
        const { getFieldsValue, setFieldsValue } = formRef;
        event.preventDefault();
        const isCheckedAll = Object
            .entries(getFieldsValue())
            .filter(([, v]) => typeof (v) === 'boolean')
            .every(([, v]) => v);
        setFieldsValue({
            item1: !isCheckedAll,
            item2: !isCheckedAll,
            item3: !isCheckedAll,
            item4: !isCheckedAll,
            item5: !isCheckedAll,
            item6: !isCheckedAll,
            item7: !isCheckedAll,
            item8: !isCheckedAll,
            item9: !isCheckedAll,
            item10: !isCheckedAll,
            item11: !isCheckedAll,
            item12: !isCheckedAll,
        });
    };

    const onTimeRangeChange = (value: SegmentedValue) => {
        switch (value) {
            case TimeRange.OneMonthAgo:
                formRef.setFieldValue('startTime', dayjs().add(-1, 'M'));
                formRef.setFieldValue('endTime', dayjs());
                break;
            case TimeRange.ThreeMonthsAgo:
                formRef.setFieldValue('startTime', dayjs().add(-3, 'M'));
                formRef.setFieldValue('endTime', dayjs());
                break;
            case TimeRange.SixMonthsAgo:
                formRef.setFieldValue('startTime', dayjs().add(-6, 'M'));
                formRef.setFieldValue('endTime', dayjs());
                break;
            case TimeRange.All:
                formRef.setFieldValue('startTime', '');
                formRef.setFieldValue('endTime', '');
                break;
        }
        setRange(value as TimeRange);
    };

    return <Modal
        footer={[
            <FooterButtonBox key="CAOM_0">
                <div>
                    <Button
                        onClick={onCheckAll}
                        type="default">
                        <CheckSquareOutlined />
                        <span>全选</span>
                    </Button>
                </div>
                <div>
                    <Button
                        onClick={onModalCancel}
                        type="default">
                        <CloseCircleOutlined />
                        <span>取消</span>
                    </Button>
                    <Button
                        onClick={onModalSave}
                        type="primary">
                        <CheckCircleOutlined />
                        <span>确定</span>
                    </Button>
                </div>
            </FooterButtonBox>
        ]}
        onCancel={onModalCancel}
        visible={visible}
        title={`${app.name ?? ''} 提取项`}
        width={600}
        maskClosable={false}
        centered={true}
        destroyOnClose={true}
        getContainer="#root"
        className="zero-padding-body">
        <Form form={formRef} layout="horizontal">
            <div style={{ padding: '24px 24px 0 24px' }}>
                <Row>
                    <Col span={24}>
                        <Item
                            name="timeRange"
                            style={{ marginBottom: 0 }}>
                            <Segmented
                                value={range}
                                onChange={onTimeRangeChange}
                                options={[
                                    { label: '近1个月', value: TimeRange.OneMonthAgo },
                                    { label: '近3个月', value: TimeRange.ThreeMonthsAgo },
                                    { label: '近6个月', value: TimeRange.SixMonthsAgo },
                                    { label: '全部', value: TimeRange.All }
                                ]}
                                style={{ width: '100%' }} />
                        </Item>
                    </Col>
                </Row>
                <Row style={{ paddingTop: '24px' }}>
                    <Col span={12}>
                        <Item name="startTime" label="起始时间">
                            <Datepicker disabled={range === TimeRange.All} allowClear={false} />
                        </Item>
                    </Col>
                    <Col span={12}>
                        <Item name="endTime" label="结束时间">
                            <Datepicker disabled={range === TimeRange.All} allowClear={false} />
                        </Item>
                    </Col>
                </Row>
            </div>
            <Divider style={{ margin: 0 }} />
            <div style={{ padding: '24px 24px 0 24px' }}>
                <Row>
                    <Col span={6}>
                        <Item
                            initialValue={true}
                            name="item1"
                            label="个人信息"
                            valuePropName="checked">
                            <Checkbox />
                        </Item>
                    </Col>
                    <Col span={6}>
                        <Item
                            initialValue={false}
                            name="item2"
                            label="实名信息"
                            valuePropName="checked">
                            <Checkbox />
                        </Item>
                    </Col>
                    <Col span={6}>
                        <Item
                            initialValue={false}
                            name="item3"
                            label="银行卡"
                            valuePropName="checked">
                            <Checkbox />
                        </Item>
                    </Col>
                    <Col span={6}>
                        <Item
                            initialValue={false}
                            name="item4"
                            label="零钱"
                            valuePropName="checked">
                            <Checkbox />
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={6}>
                        <Item initialValue={false} name="item5" label="零钱明细" valuePropName="checked">
                            <Checkbox />
                        </Item>
                    </Col>
                    <Col span={6}>
                        <Item initialValue={false} name="item6" label="帐单" valuePropName="checked">
                            <Checkbox />
                        </Item>
                    </Col>
                    <Col span={6}>
                        <Item initialValue={false} name="item7" label="帐单明细" valuePropName="checked">
                            <Checkbox />
                        </Item>
                    </Col>
                    <Col span={6}>
                        <Item initialValue={false} name="item8" label="收款码" valuePropName="checked">
                            <Checkbox />
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={6}>
                        <Item initialValue={false} name="item9" label="安全设备" valuePropName="checked">
                            <Checkbox />
                        </Item>
                    </Col>
                    <Col span={6}>
                        <Item initialValue={false} name="item10" label="登录过设备" valuePropName="checked">
                            <Checkbox />
                        </Item>
                    </Col>
                    <Col span={6}>
                        <Item initialValue={false} name="item11" label="通讯录" valuePropName="checked">
                            <Checkbox />
                        </Item>
                    </Col>
                    <Col span={6}>
                        <Item initialValue={false} name="item12" label="朋友圈" valuePropName="checked">
                            <Checkbox />
                        </Item>
                    </Col>
                </Row>
            </div>
        </Form>
    </Modal>
};

OptionsModal.defaultProps = {
    visible: false,
    app: undefined,
    onCancel: () => { },
    onSave: () => { }
};

export { OptionsModal };