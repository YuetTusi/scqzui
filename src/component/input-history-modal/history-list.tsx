import React, { FC } from 'react';
import Empty from 'antd/lib/empty';
import List from 'antd/lib/list';

const { Item } = List;

const HistoryList: FC<{ data: string[], prefix: string }> = ({ data, prefix }) =>
    data.length === 0
        ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        : <>
            {
                data.map((text, index) => {
                    return <Item style={{ padding: '5px 0' }} key={`${prefix}_${index}`}>{text}</Item>
                })
            }
        </>;

export { HistoryList };