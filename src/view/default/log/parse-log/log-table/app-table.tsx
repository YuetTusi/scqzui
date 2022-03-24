import React, { FC } from 'react';
import Empty from 'antd/lib/empty';
import Table, { ColumnProps } from 'antd/lib/table';
import { ParseApp } from '@/schema/parse-log';
import { InnerAppTableBox } from '../styled/style';

interface AppTableProp {
    /**
     * App数据
     */
    data: ParseApp[];
}

const getColumns = (): ColumnProps<ParseApp>[] => {
    return [{
        title: '应用',
        dataIndex: 'appname',
        key: 'appname'
    }, {
        title: '解析数量',
        dataIndex: 'u64count',
        key: 'u64count',
        width: 180
    }];
}

/**
 * 解析App列表
 */
const AppTable: FC<AppTableProp> = ({ data }) => {
    return (
        <InnerAppTableBox>
            <Table<ParseApp>
                dataSource={data}
                columns={getColumns()}
                pagination={false}
                bordered={true}
                size="small"
                rowKey="appname"
                locale={{
                    emptyText: <Empty description="暂无数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                }}
            />
        </InnerAppTableBox>
    );
};

export { AppTable };
