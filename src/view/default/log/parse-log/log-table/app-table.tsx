import React, { FC } from 'react';
import Table, { ColumnProps } from 'antd/lib/table';
import { helper } from '@/utils/helper';
import { ParseApp } from '@/schema/parse-log';
import { InnerAppTableBox } from '../styled/style';

const { parseText } = helper.readConf()!;

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
        title: `${parseText ?? '解析'}数量`,
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
            />
        </InnerAppTableBox>
    );
};

export { AppTable };
