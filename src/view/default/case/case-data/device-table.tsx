
import React, { FC, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Empty from 'antd/lib/empty';
import Table from 'antd/lib/table';
import { getDb } from '@/utils/db';
import { helper } from '@/utils/helper';
import DeviceType from '@/schema/device-type';
import { TableName } from '@/schema/table-name';
import { getDeviceColumns } from './column';
import { DeviceTableProp } from './prop';

const { fetchText } = helper.readConf()!;

const DeviceTable: FC<DeviceTableProp> = ({ caseId }) => {

    const [data, setData] = useState<DeviceType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const db = getDb<DeviceType>(TableName.Devices);
        (async () => {
            setLoading(true);
            let deviceData = await db.find({ caseId });
            setData(
                deviceData.sort((m: DeviceType, n: DeviceType) =>
                    dayjs(m.fetchTime).isBefore(n.fetchTime) ? 1 : -1
                )
            );
            setLoading(false);
        })();
    }, [caseId]);

    return (
        <div className="case-inner-table">
            <Table<DeviceType>
                columns={getDeviceColumns(caseId, setData, setLoading)}
                dataSource={data}
                loading={loading}
                pagination={{
                    pageSize: 9,
                    total: data ? data.length : 0,
                    showSizeChanger: false
                }}
                size="small"
                locale={{
                    emptyText: <Empty description={`无${fetchText ?? '取证'}数据`} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                }}
                rowKey={(record: DeviceType) => record._id!}
                bordered={true}
                className="inner-device-table"></Table>
        </div>
    );
};

export default DeviceTable;
