import { readFile } from 'fs/promises';
import path from 'path';
import ini from 'ini';
import React, { FC, useEffect, useState, useRef } from 'react';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined'
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import { useAppSerial } from '@/hook';
import { helper } from '@/utils/helper';
import QuickCopy from '@/component/quick-copy';
import { Manufaturer } from '@/schema/manufaturer';
import { VersionBox } from './styled/style';
import LogList from './log-list';
import logo from './images/icon.png';
import { LogItem } from './prop';
// import { useDispatch } from 'dva';

const appRootPath = process.cwd();
const config = helper.readConf();
const jsonPath =
    process.env['NODE_ENV'] === 'development'
        ? path.join(appRootPath, './data/manufaturer.json')
        : path.join(appRootPath, './resources/config/manufaturer.json');
const versionPath = path.join(appRootPath, './info.dat');

const filterString = (src: string) => src.replace(/-/g, '.');

/**
 * 版本信息
 */
const Version: FC<{}> = () => {
    // const dispatch = useDispatch();
    let [publishModalVisible, setPublishModalVisible] = useState<boolean>(false);
    let [disabled, setDisabled] = useState<boolean>(false);
    let [manu, setManu] = useState<Manufaturer | null>(null);
    let serial = useAppSerial();
    let logs = useRef<any[]>([]);

    useEffect(() => {
        (async () => {
            let exist = await helper.existFile(jsonPath);
            if (exist) {
                let next = await helper.readManufaturer();
                setManu(next);
            } else {
                setManu(null);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            let exist = await helper.existFile(versionPath);
            if (exist) {
                let logTxt = await readFile(versionPath, { encoding: 'utf8' });
                let logContent = ini.parse(logTxt);
                logContent = Object.entries(logContent);
                logs.current = logContent as Record<string, LogItem>[];
                setDisabled(false);
            } else {
                logs.current = [];
                setDisabled(true);
            }
        })();
    }, []);

    /**
     * Logo图路径
     */
    const getLogo = () => {
        if (process.env.NODE_ENV === 'development') {
            return logo;
        } else {
            const logo = path.join(appRootPath, `./resources/config/${config?.logo}`);
            return logo;
        }
    };

    /**
     * 渲染版本信息
     */
    const render = (data: Manufaturer | null) => {
        return (
            <VersionBox>
                <div className="logo">
                    <img
                        src={getLogo()}
                        alt="logo"
                        width={300}
                        height={300}
                        onDoubleClick={() => {
                            console.table(process.versions);
                        }}
                    />
                </div>
                <div className="info">
                    <div>
                        <label>产品名称</label>
                        <span className="text">{data?.materials_name ?? ''}</span>
                    </div>
                    <div>
                        <label>产品型号</label>
                        <span className="text">{data?.materials_model ?? ''}</span>
                    </div>
                    <div>
                        <label>开发方</label>
                        <span className="text">{data?.manufacturer ?? ''}</span>
                    </div>
                    <div>
                        <label>序列号</label>
                        <span className="text">
                            <QuickCopy desc="拷贝序列号">
                                <span style={{ paddingRight: '40px' }}>{serial}</span>
                            </QuickCopy>
                        </span>
                    </div>
                    <div>
                        <label>当前版本</label>
                        <span className="text">
                            {helper.isNullOrUndefinedOrEmptyString(data?.materials_software_version)
                                ? 'v0.0.1'
                                : filterString(data?.materials_software_version!)}
                        </span>
                    </div>
                    <div style={{ padding: 0 }}>
                        <label>发行日志</label>
                        <span className="text">
                            <Button
                                type="link"
                                disabled={disabled}
                                style={{ padding: 0 }}
                                onClick={() => setPublishModalVisible(true)}>
                                查看
                            </Button>
                        </span>
                    </div>
                </div>
                <Modal
                    visible={publishModalVisible}
                    footer={[
                        <Button
                            key="B1"
                            type="primary"
                            onClick={() => setPublishModalVisible(false)}>
                            <CheckCircleOutlined />
                            <span>确定</span>
                        </Button>
                    ]}
                    title="发行日志"
                    centered={true}
                    closable={false}
                    width={1050}
                    destroyOnClose={true}
                    maskClosable={false}
                    className="zero-padding-body">
                    <LogList logs={logs.current} />
                </Modal>
            </VersionBox>
        );
    };

    return render(manu);
};

export default Version;
