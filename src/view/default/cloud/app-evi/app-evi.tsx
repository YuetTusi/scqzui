import React, { FC, useState, MouseEvent } from 'react';
import { useDispatch } from 'dva';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import SendOutlined from '@ant-design/icons/SendOutlined';
import SyncOutlined from '@ant-design/icons/SyncOutlined';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import { helper } from '@/utils/helper';
import { CloudApp, FetchOption } from '@/schema/cloud-app';
import OptionsModal from '../options-modal';
import { AppEviBox } from './styled/box';
import { AppEviProp } from './prop';

const { Item } = Form;

/**
 * 应用云取操作块
 */
const AppEvi: FC<AppEviProp> = ({ app, onDelete }) => {

    const { name, option } = app;
    const dispatch = useDispatch();
    const [optionsModalVisible, setOptionsModalVisible] = useState(false);

    const renderContent = () => {
        if (helper.isNullOrUndefinedOrEmptyString(option?.qrcode)) {
            return <div className="form-box">
                <Form layout="horizontal" size="middle">
                    <Item label="验证码">
                        <Input />
                    </Item>
                </Form>
            </div>;
        } else {
            return <div className="qrcode-box">.
                <img src={option?.qrcode} width={150} alt="二维码" />
            </div>;
        }
    };

    const renderButton = () =>
        helper.isNullOrUndefinedOrEmptyString(option?.qrcode)
            ? <Button type="primary">
                <SendOutlined />
                <span>发送验证码</span>
            </Button>
            : <Button type="primary">
                <SyncOutlined />
                <span>刷新二维码</span>
            </Button>;

    /**
     * 确定handle
     * @param value 提取项
     */
    const onOptionsModalSave = (value: FetchOption) => {
        dispatch({
            type: 'cloud/setCloudApp', payload: {
                ...app,
                option: value
            }
        });
        setOptionsModalVisible(false);
    };

    /**
     * 删除Click
     */
    const onDeleteClick = (event: MouseEvent) => {
        event.preventDefault();
        onDelete(app);
    };

    return <AppEviBox>
        <div className="c-caption">
            <span>{name}</span>
            <Button
                onClick={onDeleteClick}
                disabled={option?.fetching ?? false}
                size="large"
                type="link"
                danger={true}>
                <CloseOutlined />
            </Button>
        </div>
        <div className="c-fn">
            {renderContent()}
            <div className="buttons">
                <span>
                    <Button
                        onClick={() => setOptionsModalVisible(true)}
                        color="orange">
                        <SettingOutlined />
                        <span>提取项</span>
                    </Button>
                </span>
                <span>
                    {renderButton()}
                </span>
            </div>
        </div>
        <OptionsModal
            onSave={onOptionsModalSave}
            onCancel={() => setOptionsModalVisible(false)}
            visible={optionsModalVisible}
            app={app}
        />
    </AppEviBox>;
};

AppEvi.defaultProps = {
    app: new CloudApp(),
    onDelete: () => { }
};

export { AppEvi };