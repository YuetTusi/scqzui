import FtpClient from 'ftp';
import debounce from 'lodash/debounce';
import { join, sep, normalize } from 'path';
import React, { FC, MouseEvent, useEffect, useState } from 'react';
import ApiOutlined from '@ant-design/icons/ApiOutlined';
import SaveOutlined from '@ant-design/icons/SaveOutlined';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import message from 'antd/lib/message';
import { helper } from '@/utils/helper';
import { Split } from '@/component/style-tool';
import { MainBox } from '../styled/sub-layout';
import ConfForm, { FormValue } from './conf-form';
import { TestState, TestAlert } from './test-alert';
import { BarBox } from './styled/style';
import logger from '@/utils/log';

const { useForm } = Form;
const cwd = process.cwd();
let ftpJsonPath =
    process.env['NODE_ENV'] === 'development'
        ? join(cwd, 'data/ftp.json')
        : join(cwd, 'resources/data/ftp.json'); //FTP_JSON文件路径

/**
 * 检测FTP连接
 * @param config 表单配置
 * @returns Promise
 */
const checkFtpConnect = debounce(
    (config: FormValue): Promise<boolean> => {
        let client = new FtpClient();
        return new Promise((resolve, reject) => {
            client.once('error', (err) => reject(err));
            client.once('ready', () => resolve(true));
            client.connect({
                host: config.ip,
                user: helper.isNullOrUndefinedOrEmptyString(config.username)
                    ? 'anonymous'
                    : config.username,
                password: helper.isNullOrUndefinedOrEmptyString(config.password)
                    ? 'anonymous'
                    : config.password
            });
        });
    },
    400,
    { leading: true, trailing: false }
);

const Ftp: FC<{}> = () => {

    const [formRef] = useForm<FormValue>();
    const [ftpData, setFtpData] = useState<FormValue | null>(null);
    const [state, setState] = useState<TestState>(TestState.None);

    useEffect(() => {
        readFtpJson(ftpJsonPath);
    }, []);

    /**
     * 读取ftp.json
     * @param jsonPath 路径
     */
    const readFtpJson = async (jsonPath: string) => {
        try {
            const exist: boolean = await helper.existFile(jsonPath);
            if (exist) {
                let next = await helper.readJSONFile(jsonPath);
                setFtpData(next);
            } else {
                setFtpData({
                    enable: false,
                    ip: '127.0.0.1',
                    port: 21,
                    username: '',
                    password: '',
                    serverPath: sep
                });
            }
        } catch (error) {
            logger.error(
                `查询FTP配置失败: @view/default/settings/ftp:${error.message}`
            );
        }
    };

    /**
     * 测试Click
     */
    const onCheckClick = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const { getFieldsValue, validateFields } = formRef;
        const { enable } = getFieldsValue();
        if (!enable) {
            message.destroy();
            message.info('未启用文件上传');
            return;
        }

        let values: FormValue | null = null;
        try {
            values = await validateFields();
            setState(TestState.Testing);
        } catch (error) {
            console.warn(error);
        }
        try {
            if (values !== null) {
                await checkFtpConnect(values);
                setState(TestState.Success);
            }
        } catch (error) {
            setState(TestState.Failure);
        }
    };

    /**
     * 保存Submit
     */
    const onFormSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
        const { validateFields } = formRef;
        event.preventDefault();
        let values: FormValue | null = null;
        try {
            values = await validateFields();
        } catch (error) {
            console.warn(error);
        }
        message.destroy();
        try {
            if (values !== null) {
                await helper.writeJSONfile(
                    ftpJsonPath,
                    JSON.stringify(values,
                        (key, value) => {
                            if (key === 'serverPath') {
                                return normalize(value);
                            } else {
                                return value;
                            }
                        }
                    )
                );
                message.success('保存成功');
            }
        } catch (error) {
            message.warn('保存失败');
            console.log(error);
            logger.error(`写入ftp.json失败 @view/default/settings/ftp:${error.message}`);
        }
    };

    return <MainBox>
        <BarBox>
            <div>
                <TestAlert state={state} />
            </div>
            <div>
                <Button
                    onClick={onCheckClick}
                    type="primary"
                    style={{ marginRight: '16px' }}>
                    <ApiOutlined />
                    <span>测试连接</span>
                </Button>
                <Button
                    onClick={onFormSubmit}
                    type="primary">
                    <SaveOutlined />
                    <span>保存</span>
                </Button>
            </div>
        </BarBox>
        <Split />
        <ConfForm
            data={ftpData}
            formRef={formRef} />
    </MainBox>
};

export default Ftp;