import React, { FC } from 'react';
import Empty from 'antd/lib/empty';
import List from 'antd/lib/list';
import { HistoryListProp } from './prop';

const { Item } = List;

const HistoryList: FC<HistoryListProp> = ({ data, prefix }) =>
    data.length === 0
        ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        : <>
            {
                data.map((text, index) => {
                    return <Item style={{ padding: '5px 0' }} key={`${prefix}_${index}`}>{text}</Item>
                })
            }
        </>;

HistoryList.defaultProps = {
    data: [],
    prefix: 'HL'
};

export { HistoryList };