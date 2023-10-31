import { join } from 'path';
import dayjs from 'dayjs';
import { shell } from 'electron';
import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'dva';
import AndroidFilled from '@ant-design/icons/AndroidFilled';
import AppleFilled from '@ant-design/icons/AppleFilled';
import message from 'antd/lib/message';
import Badge from 'antd/lib/badge';
import Button from 'antd/lib/button';
import { useCase, useHitCount } from '@/hook';
import { helper } from '@/utils/helper';
import Auth from '@/component/auth';
import { Split } from '@/component/style-tool';
import { DeviceType } from '@/schema/device-type';
import { ParseState } from '@/schema/device-state';
import DeviceSystem from '@/schema/device-system';
import { StateTree } from '@/type/model';
import { LoginState, TraceLoginState } from '@/model/default/trace-login';
import { ExportFullReportModal } from '../export-full-report-modal';
import { InfoBox } from './styled/style';
import { ClickType, DevInfoProp } from './prop';

const { Group } = Button;
const {
    useBcp, useTraceLogin, caseText, devText,
    fetchText, parseText
} = helper.readConf()!;

/**
 * 功能按钮禁用状态
 * 除`解析完成`都是禁用状态
 * @param parseState 解析状态
 */
const fnButtonDisable = (parseState?: ParseState) => {
    switch (parseState) {
        case ParseState.Fetching:
        case ParseState.NotParse:
        case ParseState.Exception:
        case ParseState.Parsing:
        case ParseState.Error:
            return true
        case ParseState.Finished:
            return false;
        default:
            return true;
    }
};

/**
 * 删除按钮禁用状态
 * @param parseState 解析状态
 */
const delButtonDisable = (parseState?: ParseState) => {
    switch (parseState) {
        case ParseState.Fetching:
        case ParseState.Parsing:
            return true
        case ParseState.Error:
        case ParseState.Exception:
        case ParseState.NotParse:
        case ParseState.Finished:
            return false;
        default:
            return true;
    }
};

/**
 * 是否隐藏网盘按钮
 */
const isShowNetDiskButton = (data: DeviceType, appId: string) => {
    const { cloudAppList, parseState } = data;
    return parseState === ParseState.Finished
        && (cloudAppList ?? []).some(item => item.m_strID === appId);
};

/**
 * 状态点
 * @param state 解析状态
 */
const StateDot: FC<{ state?: ParseState }> = ({ state }) => {
    let color = '';
    let text = '';
    switch (state) {
        case ParseState.Fetching:
            color = '#fff';
            text = `${fetchText ?? '取证'}中`;
            break;
        case ParseState.NotParse:
            color = '#fff';
            text = `未${parseText ?? '解析'}`;
            break;
        case ParseState.Parsing:
            color = 'blue';
            text = `${parseText ?? '解析'}中`;
            break;
        case ParseState.Finished:
            color = 'green';
            text = '完成';
            break;
        case ParseState.Error:
        case ParseState.Exception:
            color = 'red'
            text = '异常';
            break;
        default:
            color = '#fff';
            text = '未知状态';
            break;
    }
    return <Badge color={color} title={text} style={{ marginLeft: '5px' }} />
}

/**
 * 云点验按钮
 */
const CloudSearchButton: FC<{
    device: DeviceType,
    onClick: (data: DeviceType, fn: ClickType) => void
}> = ({ children, device, onClick }) => {

    const [disabled, setDisabled] = useState<boolean>(false);
    const { loginState } = useSelector<StateTree, TraceLoginState>(state => state.traceLogin);

    useEffect(() => {
        setDisabled(device.system !== DeviceSystem.Android || loginState !== LoginState.IsLogin);
    }, [device, loginState]);

    return <Button
        onClick={() => onClick(device, ClickType.CloudSearch)}
        disabled={disabled}
        type="primary">
        {children}
    </Button>
};

/**
 * 设备信息
 */
const DevInfo: FC<DevInfoProp> = ({ data, onButtonClick }) => {

    const { caseId, parseState, phonePath } = data;
    const caseData = useCase(caseId);
    const hitCount = useHitCount(data);
    const [isEmptyScreenRecord, setIsEmptyScreenRecord] = useState<boolean>(true);
    const [exportFullReportModalVisible, setExportFullReportModalVisible] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            const exist = await helper.existFile(join(phonePath!, './screen_record'));
            setIsEmptyScreenRecord(!exist);
        })();
    }, [data]);

    return <InfoBox>
        <div className="btn-bar">
            <div>
                <Group size="small">
                    <Auth deny={!useBcp}>
                        <Button
                            onClick={() => onButtonClick(data, ClickType.GenerateBCP)}
                            disabled={fnButtonDisable(parseState)}
                            type="primary">
                            生成BCP
                        </Button>
                        <Button
                            onClick={() => onButtonClick(data, ClickType.ExportBCP)}
                            disabled={fnButtonDisable(parseState)}
                            type="primary">
                            导出BCP
                        </Button>
                    </Auth>
                    <Button
                        onClick={async () => {
                            const exist = await helper.existFile(join(
                                phonePath!,
                                './report/public/data/tree.json'
                            ));
                            if (exist) {
                                setExportFullReportModalVisible(true);
                            } else {
                                message.destroy();
                                message.info('未生成报告，请重新生成报告后进行操作');
                            }
                        }}
                        type="primary">
                        导出全量报告
                    </Button>
                    <Button
                        onClick={() => shell.openPath(join(phonePath!, './screen_record'))}
                        disabled={isEmptyScreenRecord}
                        type="primary">
                        录像目录
                    </Button>
                    <Button
                        onClick={() => onButtonClick(data, ClickType.Hit)}
                        type="primary">
                        {`命中统计 (${hitCount})`}
                    </Button>
                    <Auth deny={!useTraceLogin}>
                        <CloudSearchButton
                            device={data}
                            onClick={() => onButtonClick(data, ClickType.CloudSearch)}>
                            云点验
                        </CloudSearchButton>
                    </Auth>
                    <Auth deny={!isShowNetDiskButton(data, '1280015')}>
                        <Button
                            onClick={() => onButtonClick(data, ClickType.BaiduDisk)}
                            type="primary">
                            百度网盘
                        </Button>
                    </Auth>
                    <Auth deny={!isShowNetDiskButton(data, '1280028')}>
                        <Button
                            onClick={() => onButtonClick(data, ClickType.WPSDisk)}
                            type="primary">
                            WPS云盘
                        </Button>
                    </Auth>
                </Group>
            </div>
            <div>
                <Group size="small">
                    <Button
                        onClick={() => onButtonClick(data, ClickType.Edit)}
                        type="primary">
                        编辑
                    </Button>
                    <Button
                        onClick={() => onButtonClick(data, ClickType.Delete)}
                        disabled={delButtonDisable(parseState)}
                        type="primary">
                        删除
                    </Button>
                </Group>
            </div>
        </div>
        <Split />
        <div className="dev-detail">
            <div className="os-ico">
                {
                    data.system === DeviceSystem.IOS
                        ? <AppleFilled />
                        : <AndroidFilled style={{ color: "#76c058" }} />
                }

            </div>
            <div className="desc">
                <ul>
                    <li>
                        <label htmlFor="span">{caseText ?? '案件'}</label>
                        <span>{caseData?.m_strCaseName === undefined ? '' : caseData.m_strCaseName.split('_')[0]}</span>
                    </li>
                    <li>
                        <label htmlFor="span">{`${devText ?? '设备'}名称`}</label>
                        <span>{data.mobileName === undefined ? '' : data.mobileName?.split('_')[0]}</span>
                        <StateDot state={data.parseState} />
                    </li>
                    <li>
                        <label htmlFor="span">持有人</label>
                        <span>{data.mobileHolder}</span>
                    </li>
                    <li>
                        <label htmlFor="span">{`${devText ?? '设备'}编号`}</label>
                        <span>{data.mobileNo}</span>
                    </li>
                    <li>
                        <label htmlFor="span">备注</label>
                        <span>{data.note}</span>
                    </li>
                    <li>
                        <label htmlFor="span">品牌</label>
                        <span>{data.manufacturer}</span>
                    </li>
                    <li>
                        <label htmlFor="span">型号</label>
                        <span>{data.model}</span>
                    </li>
                    <li>
                        <label htmlFor="span">序列号</label>
                        <span>{data.serial}</span>
                    </li>
                    <li>
                        <label htmlFor="span">{`${fetchText ?? '取证'}时间`}</label>
                        <span>{dayjs(data.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
                    </li>
                </ul>
            </div>
        </div>
        <ExportFullReportModal
            visible={exportFullReportModalVisible}
            onCancel={() => setExportFullReportModalVisible(false)}
            onOk={async (values) => {
                setExportFullReportModalVisible(false);
                const hide = message.loading('正在导出报告...', 0);
                try {
                    console.log(join(helper.APP_CWD, '../tools/full_report/full_report.exe'));
                    console.log([phonePath!, values.saveAt, values.suffix]);
                    await helper.runExe(
                        join(helper.APP_CWD, '../tools/full_report/full_report.exe'),
                        [phonePath!, values.saveAt, values.suffix],
                        join(helper.APP_CWD, '../tools/full_report')
                    );
                    console.log(join(values.saveAt,
                        `${helper.getNameWithoutTime(caseData?.m_strCaseName)}_${values.suffix}`,
                        `${helper.getNameWithoutTime(caseData?.m_strCaseName)}.${values.suffix}`
                    ));
                    hide();
                    message.destroy();
                    message.info('导出完成');
                    shell.showItemInFolder(
                        // iconv.encode(
                        //     join(values.saveAt,
                        //         `${helper.getNameWithoutTime(caseData?.m_strCaseName)}_${values.suffix}`,
                        //         `${helper.getNameWithoutTime(caseData?.m_strCaseName)}.${values.suffix}`
                        //     ),
                        //     'ascii').toString('binary')
                        join(values.saveAt,
                            `${helper.getNameWithoutTime(caseData?.m_strCaseName)}_${values.suffix}`,
                            `${helper.getNameWithoutTime(caseData?.m_strCaseName)}.${values.suffix}`
                        )
                    );
                } catch (error) {
                    hide();
                    message.destroy();
                    message.warn(`导出失败:${error.message}`);
                }
            }} />
    </InfoBox>;
};

export { DevInfo };