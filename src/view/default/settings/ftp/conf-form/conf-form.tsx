import classnames from 'classnames';
import React, { FC, useEffect, useState } from 'react';
import Input from 'antd/lib/input';
import Switch from 'antd/lib/switch';
import Form from 'antd/lib/form';
import { IP, Port } from '@/utils/regex';
import { Split } from '@/component/style-tool';
import { FormBox } from '../styled/style';
import { ConfFormProp, FormValue } from './prop';

const { Item } = Form;
const { Password } = Input;

const ConfForm: FC<ConfFormProp> = ({ formRef, data }) => {

    const [enable, setEnable] = useState<boolean>(false);
    const { setFieldsValue } = formRef;

    useEffect(() => {
        if (data !== null) {
            setEnable(data.enable);
            setFieldsValue(data);
        }
    }, [data]);

    return <FormBox>
        <Form form={formRef} layout="vertical">
            <div className="switch-bar">
                <label>启用上传</label>
                <Item name="enable" noStyle={true}>
                    <Switch
                        checked={enable}
                        onChange={(value) => setEnable(value)}
                        
                        checkedChildren="开"
                        unCheckedChildren="关" />
                </Item>
                <em className={classnames({
                    note: true,
                    enable
                })}>
                    开启后，生成BCP文件将自动上传至服务器
                </em>
            </div>
            <Split />
            <Item rules={[{
                required: enable,
                message: '请填写FTP地址'
            }, {
                pattern: IP,
                message: '请填写正确的IP地址'
            }]} name="ip" label="FTP地址">
                <Input disabled={!enable} placeholder="文件服务器IP地址，如192.168.1.12" />
            </Item>
            <Item rules={[{
                required: enable,
                message: '请填写端口'
            }, {
                pattern: Port,
                message: '6位数字'
            }]} name="port" label="端口">
                <Input disabled={!enable} maxLength={6} placeholder="6位数字" />
            </Item>
            <Item rules={[
                {
                    required: enable,
                    message: '请填写用户名'
                }
            ]} name="username" label="用户名">
                <Input disabled={!enable} />
            </Item>
            <Item rules={[
                {
                    required: enable,
                    message: '请填写用口令'
                }
            ]} name="password" label="口令">
                <Password disabled={!enable} />
            </Item>
            <Item rules={[
                {
                    required: enable,
                    message: '请填写上传目录'
                }
            ]} name="serverPath" label="上传目录">
                <Input disabled={!enable} />
            </Item>
        </Form >
    </FormBox >
};

export { ConfForm };