import React, { FC } from 'react';
import Empty from 'antd/lib/empty';
import Tag from 'antd/lib/tag';
import { helper } from '@/utils/helper';
import { InstallApp } from '@/schema/install-app';
import { EmptyBox } from './styled/style';


/**
 * 应用名称和包名展示
 */
const AppNameDesc: FC<{ data: InstallApp | null }> = ({ data }) => {
    if (helper.isNullOrUndefined(data)) {
        return <EmptyBox>
            <Empty description="暂无数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </EmptyBox>;
    }

    const { appNameList, cateNameList, apppkgList } = data!;

    if (helper.isNullOrUndefined(appNameList) || appNameList === '') {
        return <EmptyBox>
            <Empty description="暂无数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </EmptyBox>;
    }

    const nameList = appNameList.split('\u0001');
    const len = nameList.length;

    if (len === 0) {
        return <EmptyBox>
            <Empty description="暂无数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </EmptyBox>;
    }

    const categoryList = helper.isNullOrUndefined(cateNameList) ? [] : cateNameList.split(',');
    const appPackages = helper.isNullOrUndefined(apppkgList) ? [] : apppkgList.split(',');

    let $dom: JSX.Element[] = [];
    for (let i = 0; i < len; i++) {
        $dom.push(
            <li key={`K_${i}`}>
                <Tag>{categoryList[i] === '' ? '未知' : categoryList[i]}</Tag>
                {`${nameList[i] ?? ''} （${appPackages[i] ?? ''}）`}
            </li>
        );
    }

    return <ul>{$dom}</ul>;
};

export { AppNameDesc };
