import { uniq } from 'lodash';
import React, { Key, FC, useState } from 'react';
import { useDispatch } from 'dva';
import { Tree, message } from 'antd';
import { helper } from '@/utils/helper';
import { TreeLoading } from './tree-loading';
import { StepThreeFormValue } from '../step-form/prop';
import { CaseTreeProp } from './prop';

/**
 * 案件树
 */
const CaseTree: FC<CaseTreeProp> = ({
    loading, data, disabled, expandedKeys, onExpand
}) => {

    const dispatch = useDispatch();
    const [checkedKeys, setCheckedKeys] = useState<Key[]>([]);

    return <>
        <TreeLoading loading={loading} />
        <Tree
            onCheck={(checked, info) => {
                setCheckedKeys(checked as Key[]);
                const caseIds: string[] = uniq(info.checkedNodes.map(i => i.caseId));
                if (caseIds.length === 0) {
                    dispatch({ type: 'paperworkModal/setSelectedCaseName', payload: '' });
                } else if (caseIds.length > 1) {
                    message.destroy();
                    message.info('只可选择一个案件数据');
                } else {
                    dispatch({ type: 'paperworkModal/queryCaseName', payload: caseIds[0] });
                }
                dispatch({
                    type: 'paperworkModal/setSelectedCaseCount',
                    payload: caseIds.length
                });
                const devices = info.checkedNodes.filter(i => i._id !== undefined);
                dispatch({ type: 'paperworkModal/setCheckedDevices', payload: devices });
                //将勾选的设备初始化到第3步表单中，以便在此基础上编辑
                const defaultValues: StepThreeFormValue[] = devices.map(i => ({
                    _id: i._id,
                    mobileHolder: i.mobileHolder,
                    mobileNumber: i.mobileNumber,
                    model: i.model,
                    mobileName: helper.getNameWithoutTime(i.mobileName),
                    imei: '',
                    frontPath: '',
                    backPath: ''
                }));
                dispatch({ type: 'paperworkModal/setThreeFormValue', payload: defaultValues });
                return false;
            }}
            onExpand={onExpand}
            treeData={data}
            checkedKeys={checkedKeys}
            expandedKeys={expandedKeys}
            disabled={disabled}
            // autoExpandParent={true}
            showIcon={true}
            showLine={true}
            checkable={true} />
    </>;
};

export { CaseTree };