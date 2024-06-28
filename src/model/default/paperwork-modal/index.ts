import { Key } from 'react';
import { TreeNodeProps } from 'antd';
import { Model } from 'dva';
import effects from './effects';
import reducers from './reducers';
import DeviceType from '@/schema/device-type';
import {
    StepTwoFormValue,
    StepThreeFormValue,
    StepFourFormValue
} from '@/view/default/tool/paperwork-modal/step-form/prop';

interface PaperworkModalState {
    /**
     * 案件树
     */
    caseTree: TreeNodeProps[],
    /**
     * 展开的Key
     */
    expandedKeys: Key[],
    /**
     * 勾选的设备
     */
    checkedDevices: DeviceType[],
    /**
     * 第2步表单值
     */
    twoFormValue: StepTwoFormValue,
    /**
     * 第3步表单值
     */
    threeFormValue: StepThreeFormValue[],
    /**
     * 第4步表单值
     */
    fourFormValue: StepFourFormValue,
    /**
     * 读取中
     */
    loading: boolean
}

const model: Model = {

    namespace: 'paperworkModal',
    state: {
        caseTree: [],
        expandedKeys: [],
        checkedDevices: [],
        twoFormValue: {},
        threeFormValue: [],
        fourFormValue: {},
        loading: false
    },
    effects,
    reducers
};

export { PaperworkModalState };
export default model;