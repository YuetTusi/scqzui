import ini from 'ini';
import { readFile } from 'fs/promises';
import { join } from 'path';
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
import { ListOption } from './list-option';
import logoPng from './images/icon.png';
import { LogItem } from './prop';

const cwd = process.cwd();
const conf = helper.readConf()!;
const jsonPath =
    process.env['NODE_ENV'] === 'development'
        ? join(cwd, './data/manufaturer.json')
        : join(cwd, './resources/config/manufaturer.json');
const versionPath = join(cwd, './info.dat');

const filterString = (src: string) => src.replace(/-/g, '.');

/**
 * 版本信息
 */
const Version: FC<{}> = () => {
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
            return logoPng;
        } else {
            return join(cwd, `./resources/config/${conf.logo}`);
        }
    };

    /**
     * 渲染版本信息
     */
    const render = (data: Manufaturer | null) => <VersionBox>
        <div className="logo">
            <img
                src={getLogo()}
                alt="logo"
                width={300}
                height={300}
                onDoubleClick={() => {
                    console.clear();
                    console.table(process.versions);
                    console.table(conf);
                }}
            />
        </div>
        <div className="info">
            <ListOption label="产品名称">{data?.materials_name}</ListOption>
            <ListOption label="产品型号">{data?.materials_model}</ListOption>
            <ListOption label="开发方">{data?.manufacturer}</ListOption>
            <ListOption label="客服电话">{data?.hotline}</ListOption>
            <ListOption label="联系电话">{data?.telephone}</ListOption>
            <ListOption label="邮箱">{data?.email}</ListOption>
            <ListOption label="论坛">{data?.forum}</ListOption>
            <ListOption label="地址">{data?.address}</ListOption>
            <div style={{ padding: 0 }}>
                <label>序列号</label>
                <span className="text">
                    <QuickCopy desc="拷贝序列号">
                        <span style={{ paddingRight: '40px' }}>{serial}</span>
                    </QuickCopy>
                </span>
            </div>
            <ListOption label="版本号">
                {
                    helper.isNullOrUndefinedOrEmptyString(data?.materials_software_version)
                        ? 'v0.0.1'
                        : filterString(data?.materials_software_version!)
                }
            </ListOption>
            <ListOption label="到期时间">

            </ListOption>
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
            open={publishModalVisible}
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
    </VersionBox>;

    return render(manu);
};

export default Version;
