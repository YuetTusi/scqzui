import { Model } from 'dva';
import CaseInfo from '@/schema/case-info';
import effects from './effects';
import reducers from './reducers';
import { TreeNodeProps } from 'antd';
import { Key } from 'react';


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
     * 读取中
     */
    loading: boolean
}

const model: Model = {

    namespace: 'paperworkModal',
    state: {
        caseTree: [],
        expandedKeys: [],
        loading: false
    },
    effects,
    reducers
};

export { PaperworkModalState };
export default model;