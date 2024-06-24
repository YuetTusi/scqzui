import React, { FC, Key, useState } from 'react';
import FileTextOutlined from '@ant-design/icons/FileTextOutlined';
import { Tree } from 'antd';
import CaseInfo from '@/schema/case-info';
import { CaseTreeProp } from './prop';
import { helper } from '@/utils/helper';
import { EventDataNode } from 'antd/lib/tree';
import { getDb } from '@/utils/db';
import { TableName } from '@/schema/table-name';
import DeviceType from '@/schema/device-type';

/**
 * 案件树
 */
const CaseTree: FC<CaseTreeProp> = ({ data, expandedKeys, onExpand }) => {


    console.log(expandedKeys);

    return <Tree
        onExpand={onExpand}
        treeData={data}
        // checkedKeys={checkedKeys}
        expandedKeys={expandedKeys}
        showIcon={true}
        showLine={true}
        selectable={false}
        checkable={true} />
};

export { CaseTree };