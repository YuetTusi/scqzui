import dayjs from 'dayjs';
import React, { FC } from 'react';
import AndroidFilled from '@ant-design/icons/AndroidFilled';
import AppleFilled from '@ant-design/icons/AppleFilled';
import Badge from 'antd/lib/badge';
import Button from 'antd/lib/button';
import { Split } from '@/component/style-tool';
import { ParseState } from '@/schema/device-state';
import DeviceSystem from '@/schema/device-system';
import { InfoBox } from './styled/style';
import { ClickType, DevInfoProp } from './prop';

const { Group } = Button;

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
const DevInfo: FC<DevInfoProp> = ({ data, onButtonClick }) => {

    return <InfoBox>
        <div className="btn-bar">
            <div>
                <Group size="small">
                    <Button onClick={() => onButtonClick(data, ClickType.GenerateBCP)} type="primary">生成BCP</Button>
                    <Button onClick={() => onButtonClick(data, ClickType.ExportBCP)} type="primary">导出BCP</Button>
                    <Button onClick={() => onButtonClick(data, ClickType.CloudSearch)} type="primary">云点验</Button>
                </Group>
            </div>
            <div>
                <Group size="small">
                    <Button onClick={() => onButtonClick(data, ClickType.Edit)} type="primary">编辑</Button>
                    <Button onClick={() => onButtonClick(data, ClickType.Delete)} type="primary">删除</Button>
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
                        <label htmlFor="span">手机名称</label>
                        <span>{data.mobileName === undefined ? '' : data.mobileName?.split('_')[0]}</span>
                        <StateDot state={data.parseState} />
                    </li>
                    <li>
                        <label htmlFor="span">持有人</label>
                        <span>{data.mobileHolder}</span>
                    </li>
                    <li>
                        <label htmlFor="span">手机编号</label>
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
                        <label htmlFor="span">取证时间</label>
                        <span>{dayjs(data.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
                    </li>
                </ul>
            </div>
        </div>
    </InfoBox>;
};

export { DevInfo };