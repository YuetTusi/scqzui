import React, { FC } from 'react';
import { useDispatch } from 'dva';
import { Tree } from 'antd';
import { helper } from '@/utils/helper';
import { StepThreeFormValue } from '../step-form/prop';
import { CaseTreeProp } from './prop';

/**
 * 案件树
 */
const CaseTree: FC<CaseTreeProp> = ({ data, expandedKeys, onExpand }) => {

    const dispatch = useDispatch();

    return <Tree
        onCheck={(_, info) => {
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
        }}
        onExpand={onExpand}
        treeData={data}
        // checkedKeys={checkedKeys}
        expandedKeys={expandedKeys}
        showIcon={true}
        showLine={true}
        checkable={true} />
};

export { CaseTree };