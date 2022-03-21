import dayjs from 'dayjs';
import React, { FC, memo } from 'react';
import AndroidFilled from '@ant-design/icons/AndroidFilled';
import AppleFilled from '@ant-design/icons/AppleFilled';
import Badge from 'antd/lib/badge';
import Empty from 'antd/lib/empty';
import { useCase, useDevice } from '@/hook';
import { ParseState } from '@/schema/device-state';
import DeviceSystem from '@/schema/device-system';
import { DeviceBox } from './styled/style';
import { DeviceInfoProp } from './prop';
import DeviceType from '@/schema/device-type';
import { helper } from '@/utils/helper';
import CaseInfo from '@/schema/case-info';


/**
 * 状态点
 * @param state 解析状态
 */
const StateDot: FC<{ state?: ParseState }> = ({ state }) => {
    let color = '';
    switch (state) {
        case ParseState.Fetching:
        case ParseState.NotParse:
            color = '#fff';
            break;
        case ParseState.Parsing:
            color = 'blue';
            break;
        case ParseState.Finished:
            color = 'green';
            break;
        case ParseState.Error:
        case ParseState.Exception:
            color = 'red'
            break;
        default:
            color = '#fff';
            break;
    }
    return <Badge color={color} style={{ marginLeft: '5px' }} />
}

/**
 * 设备信息
 */
const DeviceInfo: FC<DeviceInfoProp> = memo(({ caseId, deviceId }) => {

    const caseData = useCase(caseId);
    const devcieData = useDevice(deviceId);

    const renderCaseDevice = (caseData: CaseInfo | null, deviceData: DeviceType | null) => {

        if (deviceData === null) {
            return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无设备数据" />
        }
        return <DeviceBox>
            <div className="dev-detail">
                <div className="os-ico">
                    {
                        deviceData.system === DeviceSystem.IOS
                            ? <AppleFilled />
                            : <AndroidFilled style={{ color: "#76c058" }} />
                    }

                </div>
                <div className="desc">
                    <ul>
                        <li>
                            <label htmlFor="span">所属案件</label>
                            <span>{
                                helper.isNullOrUndefinedOrEmptyString(caseData?.spareName)
                                    ? helper.getNameWithoutTime(caseData?.m_strCaseName)
                                    : caseData?.spareName}</span>
                        </li>
                        <li>
                            <label htmlFor="span">手机名称</label>
                            <span>{deviceData.mobileName === undefined ? '' : deviceData.mobileName?.split('_')[0]}</span>
                            <StateDot state={deviceData.parseState} />
                        </li>
                        <li>
                            <label htmlFor="span">持有人</label>
                            <span>{deviceData.mobileHolder}</span>
                        </li>
                        <li>
                            <label htmlFor="span">手机编号</label>
                            <span>{deviceData.mobileNo}</span>
                        </li>
                        <li>
                            <label htmlFor="span">备注</label>
                            <span>{deviceData.note}</span>
                        </li>
                        <li>
                            <label htmlFor="span">品牌</label>
                            <span>{deviceData.manufacturer}</span>
                        </li>
                        <li>
                            <label htmlFor="span">型号</label>
                            <span>{deviceData.model}</span>
                        </li>
                        <li>
                            <label htmlFor="span">序列号</label>
                            <span>{deviceData.serial}</span>
                        </li>
                        <li>
                            <label htmlFor="span">取证时间</label>
                            <span>{dayjs(deviceData.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </DeviceBox>;

    }

    return renderCaseDevice(caseData, devcieData);
});

export { DeviceInfo };