import dayjs from 'dayjs';
import clone from 'lodash/clone';
import React, { FC } from 'react';
import AndroidFilled from '@ant-design/icons/AndroidFilled';
import AppleFilled from '@ant-design/icons/AppleFilled';
import Badge from 'antd/lib/badge';
import Button from 'antd/lib/button';
import { useQuickHitCount, useQuickEvent } from '@/hook';
import { helper } from '@/utils/helper';
import { Split } from '@/component/style-tool';
import { ParseState } from '@/schema/device-state';
import DeviceSystem from '@/schema/device-system';
import { InfoBox } from './styled/style';
import { ClickType, RecordInfoProp } from './prop';

const { caseText, devText, fetchText } = helper.readConf()!;
const { Group } = Button;

/**
 * 命中按钮禁用状态
 * 除`解析完成`都是禁用状态
 * @param parseState 解析状态
 */
const hitButtonDisable = (parseState?: ParseState) => {
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
            text = '未解析';
            break;
        case ParseState.Parsing:
            color = 'blue';
            text = '解析中';
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
 * 快速点验设备信息
 */
const RecordInfo: FC<RecordInfoProp> = ({ data, onButtonClick }) => {

    const { caseId, parseState } = data;
    const eventData = useQuickEvent(caseId!);
    const hitCount = useQuickHitCount(clone(data));//命中数量

    return <InfoBox>
        <div className="btn-bar">
            <div>
                <Group size="small">
                    <Button
                        disabled={hitButtonDisable(parseState)}
                        onClick={() => onButtonClick(data, ClickType.Hit)}
                        type="primary">{`命中统计 (${hitCount})`}</Button>
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
                        <label htmlFor="span">{`所属${caseText ?? '案件'}`}</label>
                        <span>{eventData?.eventName === undefined ? '' : eventData.eventName.split('_')[0]}</span>
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
                        <label htmlFor="span">{`${fetchText ?? '点验'}时间`}</label>
                        <span>{dayjs(data.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
                    </li>
                </ul>
            </div>
        </div>
    </InfoBox>;
};

export { RecordInfo, StateDot };