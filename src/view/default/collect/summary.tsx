import React, { FC, useState, MouseEvent } from 'react';
import { useSelector } from 'dva';
import { StateTree } from '@/type/model';
import DeviceType from '@/schema/device-type';
import { FetchStateModalState } from '@/model/default/fetch-state-modal';
import { SummaryBox } from './styled/summary-box';
import { FetchStateModal } from '@/component/dialog';

/**
 * 采集消息汇总
 */
const Summary: FC<{ device: DeviceType }> = ({ device }) => {

    const { data } = useSelector<StateTree, FetchStateModalState>(state =>
        state.fetchStateModal
    );

    const [fetchStateModalVisible, setFetchStateModalVisible] = useState<boolean>(false);

    const getInfo = () => {

        if (device === undefined || device === null) {
            return <div />;
        }

        const { usb } = device!;
        if (data[usb!] === undefined || data[usb!] === null) {
            return <div />;
        }

        const { summary } = data[usb!];
        if (summary === undefined) {
            return <div />;
        } else {
            return <div>
                <label>{summary.name}</label>
                <span>{summary.value}</span>
            </div>;
        }
    };

    const onSummaryClick = (event: MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        setFetchStateModalVisible(true);
    };

    return <>
        <SummaryBox onClick={onSummaryClick}>
            {getInfo()}
        </SummaryBox>
        <FetchStateModal
            device={device}
            open={fetchStateModalVisible}
            onCancel={() => setFetchStateModalVisible(false)}
        />
    </>;
};

export { Summary };