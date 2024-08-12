import { join } from 'path';
import React, { FC, useEffect, useState } from 'react';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Form from 'antd/lib/form';
import Modal from 'antd/lib/modal';
import { No } from '@/utils/regex';
import { helper } from '@/utils/helper';
import { Manufaturer } from '@/schema/manufaturer';
import { SofthardwareModalProp } from './prop';

const { Item, useForm } = Form;
const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 18 }
};

/**
 * 软硬件信息配置框
 */
const SofthardwareModal: FC<SofthardwareModalProp> = ({ visible, closeHandle }) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [formRef] = useForm<Manufaturer>();

    useEffect(() => {
        const { setFieldsValue } = formRef;
        (async () => {
            if (visible) {
                try {
                    const manu = await helper.readManufaturer();
                    setFieldsValue(manu);
                } catch (error) {
                    console.warn(error);
                }
            }
        })();
    }, [visible]);

    useEffect(() => {
        const { resetFields } = formRef;
        return () => resetFields();
    }, []);

    /**
     * 保存
     */
    const save = async () => {
        const { validateFields } = formRef;
        const saveTo = helper.IS_DEV
            ? join(helper.APP_CWD, './data/manufaturer.json')
            : join(helper.APP_CWD, './resources/config/manufaturer.json');
        setLoading(true);
        try {
            const values = await validateFields();
            const success = await helper.writeJSONfile(saveTo, values);
            if (success) {
                Modal.success({
                    onOk() {
                        closeHandle();
                    },
                    title: '保存成功',
                    content: '请重启应用生效新配置',
                    okText: '知道了',
                    centered: true
                });
            } else {
                Modal.warn({
                    title: '保存失败',
                    content: '保存文件失败',
                    okText: '确定',
                    centered: true
                });
            }
        } catch (error) {
            console.warn(error);
        } finally {
            setLoading(false);
        }
    };

    return <Modal
        footer={[
            <Button onClick={() => {
                formRef.resetFields();
                closeHandle();
            }}
                type="default"
                key="SM_0">
                <CloseCircleOutlined />
                <span>取消</span>
            </Button>,
            <Button
                onClick={() => save()}
                disabled={loading}
                type="primary"
                key="SM_1">
                {loading ? <LoadingOutlined /> : <CheckCircleOutlined />}
                <span>确定</span>
            </Button>
        ]}
        onCancel={() => {
            formRef.resetFields();
            closeHandle();
        }}
        visible={visible}
        title="软硬件信息配置"
        width={850}
        centered={true}
        forceRender={true}
        maskClosable={false}
        destroyOnClose={true}>
        <Form form={formRef} layout="horizontal" {...formItemLayout}>
            <Item label="开发方（制造商名称）" name="manufacturer">
                <Input maxLength={128} />
            </Item>
            <Row>
                <Col span={12}>
                    <Item
                        labelCol={{ span: 10 }}
                        wrapperCol={{ span: 14 }}
                        label="客服电话"
                        name="hotline">
                        <Input maxLength={100} />
                    </Item>
                </Col>
                <Col span={12}>
                    <Item
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 14 }}
                        label="联系电话"
                        name="telephone">
                        <Input maxLength={100} />
                    </Item>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Item
                        labelCol={{ span: 10 }}
                        wrapperCol={{ span: 14 }}
                        label="邮箱"
                        name="email">
                        <Input />
                    </Item>
                </Col>
                <Col span={12}>
                    <Item
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 14 }}
                        label="论坛"
                        name="forum">
                        <Input />
                    </Item>
                </Col>
            </Row>
            <Item
                label="地址"
                name="address">
                <Input />
            </Item>
            <Item label="厂商组织机构代码" name="security_software_orgcode">
                <Input maxLength={9} />
            </Item>
            <Row>
                <Col span={12}>
                    <Item
                        labelCol={{ span: 10 }}
                        wrapperCol={{ span: 14 }}
                        label="产品名称" name="materials_name">
                        <Input maxLength={128} />
                    </Item>
                </Col>
                <Col span={12}>
                    <Item
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 14 }}
                        label="产品型号" name="materials_model">
                        <Input maxLength={64} />
                    </Item>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Item
                        labelCol={{ span: 10 }}
                        wrapperCol={{ span: 14 }}
                        label="设备硬件版本号"
                        name="materials_hardware_version">
                        <Input maxLength={64} />
                    </Item>
                </Col>
                <Col span={12}>
                    <Item
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 14 }}
                        label="设备软件版本号"
                        name="materials_software_version">
                        <Input maxLength={128} />
                    </Item>
                </Col>
            </Row>
            <Item label="设备序列号" name="materials_serial">
                <Input maxLength={64} />
            </Item>
            <Item rules={[
                { pattern: No, message: '请输入数字' }
            ]} label="采集点IP" name="ip_address">
                <Input maxLength={10} />
            </Item>
        </Form>
    </Modal >
};

export default SofthardwareModal;