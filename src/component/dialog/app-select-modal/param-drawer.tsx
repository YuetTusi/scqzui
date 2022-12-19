import React, { FC, MouseEvent, useEffect, useState } from 'react';
import { useSelector } from 'dva';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Drawer from 'antd/lib/drawer';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import { App, AppCategory, CloudExt } from '@/schema/app-config';
import { StateTree } from '@/type/model';
import { AppSetStore } from '@/model/default/app-set';

const { Item, useForm } = Form;

/**
 * 查找应用
 * @param apps 云取应用
 * @param id 要查找的应用id
 */
const findCloudApp = (apps: AppCategory[], id: string) => apps.reduce((acc: App[], current: AppCategory) => {
    acc = acc.concat(current.app_list);
    return acc;
}, []).find(item => item.app_id === id);
//

/**
 * 云取应用参数设置
 */
const ParamDrawer: FC<{
    /**
     * 显示
     */
    visible: boolean,
    /**
     * 云取应用id
     */
    id: string,
    /**
     * 名称
     */
    name: string,
    /**
     * 输入项
     */
    ext: CloudExt[],
    /**
     * 确定handle
     */
    okHandle: (id: string, values: Record<string, string>) => void
    /**
     * 关闭handle
     */
    closeHandle: () => void
}> = ({ visible, id, name, ext, okHandle, closeHandle }) => {

    const [formRef] = useForm<Record<string, string>>();
    const [currentApp, setCurrentApp] = useState<App>();
    const { cloudAppData } = useSelector<StateTree, AppSetStore>(state => state.appSet);

    useEffect(() => {
        const app = findCloudApp(cloudAppData, id);
        setCurrentApp(app);
    }, [id, cloudAppData]);

    useEffect(() => {
        //向表单赋默认值
        const { setFieldsValue } = formRef;
        if (currentApp && currentApp.ext) {
            const values = currentApp.ext.reduce((acc, current) => {
                acc = {
                    ...acc,
                    [current.name]: current.value
                }
                return acc;
            }, {});
            setFieldsValue(values);
        }
    }, [currentApp]);

    const renderItem = () => ext
        .map(({ title, name }, index) => <Item
            label={title}
            name={name}
            key={`CP_${index}`}>
            <Input />
        </Item>);

    /**
     * 确定Click
     */
    const onClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const { getFieldsValue } = formRef;
        const values = getFieldsValue();
        okHandle(id, values);
    };

    return <Drawer
        visible={visible}
        title={`${name}参数设置`}
        onClose={() => {
            setCurrentApp(void 0);
            closeHandle();
        }}
        getContainer={() => document.getElementById('root')!}
        destroyOnClose={true}
        forceRender={true}
        style={{ top: '22px' }}>
        <Form
            form={formRef}
            size="small"
            layout="vertical">
            {renderItem()}
            <Row justify="end">
                <Col>
                    <Item>
                        <Button
                            onClick={onClick}
                            type="primary">
                            <CheckCircleOutlined />
                            <span>确定</span>
                        </Button>
                    </Item>
                </Col>
            </Row>
        </Form>
    </Drawer>
}

ParamDrawer.defaultProps = {
    id: '',
    ext: [],
    name: ''
};

export { ParamDrawer };