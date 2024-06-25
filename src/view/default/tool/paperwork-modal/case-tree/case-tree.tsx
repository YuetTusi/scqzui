import React, { FC } from 'react';
import { Tree } from 'antd';
import { CaseTreeProp } from './prop';
import { useDispatch, useSelector } from 'dva';
import { StateTree } from '@/type/model';


/**
 * 案件树
 */
const CaseTree: FC<CaseTreeProp> = ({ data, expandedKeys, onExpand }) => {

    const dispatch = useDispatch();

    return <Tree
        onCheck={(_, info) => {
            const holder = info.checkedNodes.map(i => i.mobileHolder);
            dispatch({ type: 'paperworkModal/setCheckedHolders', payload: holder });
        }}
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