import React, { FC } from 'react';
import Empty from 'antd/lib/empty';
import Tag from 'antd/lib/tag';
import { helper } from '@/utils/helper';
import { InstallApp } from '@/schema/install-app';
import { EmptyBox } from './styled/style';

/**
 * 应用变化展示
 */
const ChangeDesc: FC<{ data: InstallApp | null }> = ({ data }) => {
    if (helper.isNullOrUndefined(data)) {
        return (
            <EmptyBox>
                <Empty description="暂无数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </EmptyBox>
        );
    }

    const { changePkgList, changePkgStatusList, changePkgTimeList } = data!;

    if (helper.isNullOrUndefined(changePkgList)) {
        return (
            <EmptyBox>
                <Empty description="暂无数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </EmptyBox>
        );
    }

    if (changePkgList.trim() === '') {
        return (
            <EmptyBox>
                <Empty description="暂无数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </EmptyBox>
        );
    }

    const pkgList = changePkgList.split(',');
    const len = pkgList.length;

    if (len === 0) {
        return (
            <EmptyBox>
                <Empty description="暂无数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </EmptyBox>
        );
    }

    const statusList = helper.isNullOrUndefined(changePkgStatusList)
        ? []
        : changePkgStatusList.split(',');
    const timeList = helper.isNullOrUndefined(changePkgTimeList)
        ? []
        : changePkgTimeList.split(',');
    let $dom: JSX.Element[] = [];
    for (let i = 0; i < len; i++) {
        $dom.push(
            <li key={`K_${i}`}>
                {statusList[i] === '-1' ? (
                    <Tag color="red">卸载</Tag>
                ) : (
                    <Tag color="green">安装</Tag>
                )}
                {pkgList[i] ?? ''}（{timeList[i] ?? ''}）
            </li>
        );
    }

    return <ul>{$dom}</ul>;
};

export { ChangeDesc };
