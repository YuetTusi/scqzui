import React, { FC } from 'react';
import Descriptions from 'antd/lib/descriptions';
import { helper } from '@/utils/helper';
import { FetchInfoProp } from './prop';
import { InfoBox } from './styled/box';

const { Item } = Descriptions;
const { caseText, devText } = helper.readConf()!;

const FetchInfo: FC<FetchInfoProp> = ({ data }) => {

    console.log(data);

    if (data === null) {
        // return <Empty description="未录入取证信息" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
        return null;
    }
    else {
        return <InfoBox>
            <Descriptions size="small" bordered={true}>
                <Item label={`${caseText ?? '案件'}`} span={3}>
                    <div className="text-label">{data.caseName?.split('_')[0]}</div>
                </Item>
                <Item label={`${devText ?? '设备'}名称`}>
                    <div className="text-label">{data.mobileName?.split('_')[0] ?? '-'}</div>
                </Item>
                <Item label="手机号">
                    <div className="text-label">
                        {data.mobileNumber ?? '-'}
                    </div>
                </Item>
                <Item label="持有人">
                    <div className="text-label">{data.mobileHolder ?? '-'}</div>
                </Item>
            </Descriptions>
        </InfoBox>
    }
};

export { FetchInfo };