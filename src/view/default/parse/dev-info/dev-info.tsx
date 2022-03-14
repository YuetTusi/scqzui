import dayjs from 'dayjs';
import React, { FC } from 'react';
import AndroidFilled from '@ant-design/icons/AndroidFilled';
import AppleFilled from '@ant-design/icons/AppleFilled';
import Button from 'antd/lib/button';
import Descriptions from 'antd/lib/descriptions';
import { DevInfoProp } from './prop';
import { InfoBox } from './styled/style';
import { Split } from '@/component/style-tool';
import { helper } from '@/utils/helper';
import DeviceSystem from '@/schema/device-system';

const { Group } = Button;
const { Item } = Descriptions;

/**
 * 设备信息
 */
const DevInfo: FC<DevInfoProp> = ({ data }) => {

    return <InfoBox>
        <div className="btn-bar">
            <div>
                <Group size="small">
                    <Button type="primary">生成BCP</Button>
                    <Button type="primary">导出BCP</Button>
                    <Button type="primary">云点验</Button>
                </Group>
            </div>
            <div>
                <Group size="small">
                    <Button type="primary">编辑</Button>
                    <Button type="primary">删除</Button>
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